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
      mock.onGet(`${threadsURL}?last_id=abc123`).reply(200, listResponse);

      const result = await threadsAPI.getList(42, { last_id: "abc123" });

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
  });

  describe("delete(): ", () => {
    it("deletes a thread.", async () => {
      mock.onDelete(`${threadsURL}/1700000000000124`).reply(204);

      const result = await threadsAPI.delete(42, "1700000000000124");

      expect(result).toBeUndefined();
    });
  });
});
