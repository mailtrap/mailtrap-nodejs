import * as http from "http";
import { AddressInfo } from "net";
import { inspect } from "util";

import axios, { AxiosAdapter, AxiosError } from "axios";

import MailtrapClient from "../../lib/MailtrapClient";
import MailtrapError from "../../lib/MailtrapError";

const CANARY_TOKEN = "canary-token-3f9c2a7e";

/** The ES5 typings in use don't know about `Error#cause`. */
type ErrorWithCause = MailtrapError & { cause?: unknown };

const mail = {
  from: { email: "sender@example.com" },
  to: [{ email: "recipient@example.com" }],
  subject: "Subject",
  text: "Body",
};

/**
 * Lists the paths of every string reachable from `root` (own keys, including
 * non-enumerable and symbol ones) that contains `needle`.
 */
function findReachable(root: unknown, needle: string): string[] {
  const seen = new Set<unknown>();
  const hits: string[] = [];

  const walk = (value: unknown, path: string) => {
    if (typeof value === "string") {
      if (value.includes(needle)) hits.push(path);
      return;
    }
    if (value === null || typeof value !== "object" || seen.has(value)) {
      return;
    }
    seen.add(value);

    Reflect.ownKeys(value).forEach((key) => {
      let child: unknown;
      try {
        child = (value as Record<PropertyKey, unknown>)[key];
      } catch {
        return;
      }
      walk(child, `${path}.${String(key)}`);
    });
  };

  walk(root, "err");

  return hits;
}

function expectNoToken(err: unknown) {
  expect(inspect(err, { depth: Infinity })).not.toContain(CANARY_TOKEN);
  expect(inspect(err, { depth: Infinity, showHidden: true })).not.toContain(
    CANARY_TOKEN
  );
  expect(JSON.stringify(err)).not.toContain(CANARY_TOKEN);
  expect(JSON.stringify((err as ErrorWithCause).cause)).not.toContain(
    CANARY_TOKEN
  );
  expect(findReachable(err, CANARY_TOKEN)).toEqual([]);
}

async function catchError(promise: Promise<unknown>): Promise<ErrorWithCause> {
  try {
    await promise;
  } catch (err) {
    return err as ErrorWithCause;
  }
  throw new Error("expected the promise to reject");
}

/**
 * Creates a client whose requests go through the real Node.js HTTP adapter to
 * `target(url)`, so errors carry a real `ClientRequest` with the raw headers.
 */
function createLocalClient(target: (url: string) => string): MailtrapClient {
  const httpAdapter = axios.getAdapter("http");
  const previousAdapter = axios.defaults.adapter;
  const localAdapter: AxiosAdapter = (config) =>
    httpAdapter({ ...config, url: target(config.url ?? "") });

  axios.defaults.adapter = localAdapter;
  try {
    return new MailtrapClient({ token: CANARY_TOKEN, accountId: 1 });
  } finally {
    axios.defaults.adapter = previousAdapter;
  }
}

describe("lib/axios-logger: token redaction over real HTTP", () => {
  let server: http.Server;
  let baseUrl: string;
  let client: MailtrapClient;

  beforeAll(async () => {
    server = http.createServer((req, res) => {
      // Slow enough to still be in flight while another request fails.
      const delay = req.url?.startsWith("/api/accounts") ? 200 : 0;
      setTimeout(() => {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ errors: ["Unauthorized"] }));
      }, delay);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    client = createLocalClient((url) =>
      url.replace(/^https:\/\/[^/]+/, baseUrl)
    );
  });

  afterAll(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  it("keeps the token out of errors from send(), with a request in flight", async () => {
    // A pending request keeps a socket, and its raw headers, in the keep-alive agent.
    const inFlight = client.general.accounts.getAllAccounts().catch(() => {});
    const err = await catchError(client.send(mail));

    expect(err).toBeInstanceOf(MailtrapError);
    expect(err.message).toBe("Unauthorized");

    const { cause } = err;
    expect(axios.isAxiosError(cause)).toBe(true);
    if (!axios.isAxiosError(cause)) return;

    expect(cause).toBeInstanceOf(AxiosError);
    expect(cause.status).toBe(401);
    expect(cause.response?.status).toBe(401);
    expect(cause.response?.data).toEqual({ errors: ["Unauthorized"] });
    expect(cause.config?.url).toBe(`${baseUrl}/api/send`);
    expect(cause.config?.method).toBe("post");
    expect(cause.config?.headers.Authorization).toBe("[REDACTED]");
    expect(cause.config?.headers.get("User-Agent")).toBeDefined();
    expect(cause.response?.config.headers.Authorization).toBe("[REDACTED]");
    expect(cause.request).toBeUndefined();
    expect(cause.response?.request).toBeUndefined();

    expectNoToken(err);
    await inFlight;
  });

  it("keeps the token out of errors from batchSend()", async () => {
    const err = await catchError(
      client.batchSend({ base: mail, requests: [{ to: mail.to }] })
    );

    expect(err.message).toBe("Unauthorized");
    expect((err.cause as AxiosError).response?.status).toBe(401);
    expectNoToken(err);
  });

  it("keeps the token out of errors from the API resources", async () => {
    const err = await catchError(client.general.accounts.getAllAccounts());

    expect(err.message).toBe("Unauthorized");
    expect((err.cause as AxiosError).response?.status).toBe(401);
    expectNoToken(err);
  });

  it("keeps the token out of network errors", async () => {
    const closed = http.createServer();
    await new Promise<void>((resolve) => {
      closed.listen(0, "127.0.0.1", resolve);
    });
    const { port } = closed.address() as AddressInfo;
    await new Promise((resolve) => {
      closed.close(resolve);
    });

    const offlineClient = createLocalClient(
      () => `http://127.0.0.1:${port}/api/send`
    );

    const err = await catchError(offlineClient.send(mail));

    expect(err).toBeInstanceOf(MailtrapError);
    expect(axios.isAxiosError(err.cause)).toBe(true);
    expect((err.cause as AxiosError).code).toBe("ECONNREFUSED");
    expectNoToken(err);
  });
});
