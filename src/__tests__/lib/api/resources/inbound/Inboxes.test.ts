import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import InboxesApi from "../../../../../lib/api/resources/inbound/Inboxes";
import { Inbox } from "../../../../../types/api/inbound/inboxes";

describe("lib/api/resources/inbound/Inboxes: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);
  axiosInstance.interceptors.response.use((response) => response.data);

  const inboxesAPI = new InboxesApi(axiosInstance);
  const inboxesURL = "https://mailtrap.io/api/inbound/folders/7/inboxes";

  const inbox: Inbox = {
    id: 42,
    name: "Support tickets",
    address: "support-tickets-1a2b3c4d@inbound-mailtrap.io",
    domain_id: 892,
  };

  afterEach(() => mock.reset());

  describe("getList(): ", () => {
    it("returns all inboxes in a folder.", async () => {
      mock.onGet(inboxesURL).reply(200, [inbox]);

      const result = await inboxesAPI.getList(7);

      expect(result).toEqual([inbox]);
    });
  });

  describe("get(): ", () => {
    it("returns a single inbox by id.", async () => {
      mock.onGet(`${inboxesURL}/42`).reply(200, inbox);

      const result = await inboxesAPI.get(7, 42);

      expect(result).toEqual(inbox);
    });
  });

  describe("create(): ", () => {
    it("creates a hosted inbox.", async () => {
      const params = { name: "Support tickets" };

      mock.onPost(inboxesURL, params).reply(201, inbox);

      const result = await inboxesAPI.create(7, params);

      expect(result).toEqual(inbox);
    });

    it("creates a custom-domain inbox with domain_id.", async () => {
      const params = { name: "Support tickets", domain_id: 892 };

      mock.onPost(inboxesURL, params).reply(201, inbox);

      const result = await inboxesAPI.create(7, params);

      expect(result).toEqual(inbox);
    });
  });

  describe("update(): ", () => {
    it("updates an inbox.", async () => {
      const params = { name: "Renamed" };
      const updated: Inbox = { ...inbox, name: "Renamed" };

      mock.onPatch(`${inboxesURL}/42`, params).reply(200, updated);

      const result = await inboxesAPI.update(7, 42, params);

      expect(result).toEqual(updated);
    });
  });

  describe("delete(): ", () => {
    it("deletes an inbox.", async () => {
      mock.onDelete(`${inboxesURL}/42`).reply(204);

      const result = await inboxesAPI.delete(7, 42);

      expect(result).toBeUndefined();
    });
  });
});
