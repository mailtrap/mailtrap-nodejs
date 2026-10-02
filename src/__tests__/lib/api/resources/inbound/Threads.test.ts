import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import ThreadsApi from "../../../../../lib/api/resources/inbound/Threads";
import {
  Thread,
  ThreadsListResponse,
} from "../../../../../types/api/inbound/threads";

describe("lib/api/resources/inbound/Threads: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);
  axiosInstance.interceptors.response.use((response) => response.data);

  const threadsAPI = new ThreadsApi(axiosInstance);
  const threadsURL = "https://mailtrap.io/api/inbound/inboxes/42/threads";

  afterEach(() => mock.reset());

  describe("getList(): ", () => {
    const listResponse: ThreadsListResponse = {
      data: [],
      total_count: 0,
      last_id: null,
    };

    it("lists threads in an inbox.", async () => {
      mock.onGet(threadsURL).reply(200, listResponse);

      const result = await threadsAPI.getList(42);

      expect(result).toEqual(listResponse);
    });

    it("passes last_id for pagination.", async () => {
      const lastId = "WzE3NzgyNDE5MDAwMDAsIjE3MDAwMDAwMDAwMDAxMjMiXQ==";

      mock
        .onGet(threadsURL, { params: { last_id: lastId } })
        .reply(200, listResponse);

      const result = await threadsAPI.getList(42, { last_id: lastId });

      expect(mock.history.get[0].params).toEqual({ last_id: lastId });
      expect(result).toEqual(listResponse);
    });

    it("passes search to filter threads.", async () => {
      mock
        .onGet(threadsURL, { params: { search: "acme" } })
        .reply(200, listResponse);

      const result = await threadsAPI.getList(42, { search: "acme" });

      expect(mock.history.get[0].params).toEqual({ search: "acme" });
      expect(result).toEqual(listResponse);
    });

    it("combines search with last_id when paginating.", async () => {
      const params = { search: "acme", last_id: "abc123" };

      mock.onGet(threadsURL, { params }).reply(200, listResponse);

      const result = await threadsAPI.getList(42, params);

      expect(mock.history.get[0].params).toEqual(params);
      expect(result).toEqual(listResponse);
    });
  });

  describe("get(): ", () => {
    it("returns a single thread with messages.", async () => {
      const thread = {
        id: "1700000000000124",
        messages: [],
      } as unknown as Thread;

      mock.onGet(`${threadsURL}/1700000000000124`).reply(200, thread);

      const result = await threadsAPI.get(42, "1700000000000124");

      expect(result).toEqual(thread);
    });

    it("returns forwards on inbound and delivery on outbound messages.", async () => {
      const thread = {
        id: "1700000000000124",
        messages: [
          {
            visibility_status: "available",
            direction: "inbound",
            id: "1700000000000123",
            forwards: [
              {
                rule_id: 7,
                rule_name: "Copy to support team",
                destination: "team@example.com",
                status: "forwarded",
                reason: null,
                message_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              },
            ],
          },
          {
            visibility_status: "available",
            direction: "outbound",
            id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
            delivery: {
              to: "customer@example.com",
              status: "delivered",
              delivered_at: "2026-05-08T11:40:05.000Z",
              bounced_at: null,
            },
          },
          { visibility_status: "placeholder", direction: "inbound" },
        ],
      } as unknown as Thread;

      mock.onGet(`${threadsURL}/1700000000000124`).reply(200, thread);

      const result = await threadsAPI.get(42, "1700000000000124");
      const [received, sent, placeholder] = result.messages;

      expect(result).toEqual(thread);
      expect(received.forwards?.[0].status).toEqual("forwarded");
      expect(sent.delivery?.status).toEqual("delivered");
      expect(sent.delivery?.bounced_at).toBeNull();
      expect(placeholder.forwards).toBeUndefined();
      expect(placeholder.delivery).toBeUndefined();
    });
  });

  describe("delete(): ", () => {
    it("deletes a thread.", async () => {
      mock.onDelete(`${threadsURL}/1700000000000124`).reply(204);

      const result = await threadsAPI.delete(42, "1700000000000124");

      expect(result).toBeUndefined();
    });
  });
});
