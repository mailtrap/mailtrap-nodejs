import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import MessagesApi from "../../../../../lib/api/resources/inbound/Messages";
import {
  MessageDetails,
  MessagesListResponse,
  SendMessageResult,
  ForwardMessageParams,
} from "../../../../../types/api/inbound/messages";

describe("lib/api/resources/inbound/Messages: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);
  axiosInstance.interceptors.response.use((response) => response.data);

  const messagesAPI = new MessagesApi(axiosInstance);
  const messagesURL = "https://mailtrap.io/api/inbound/inboxes/42/messages";

  afterEach(() => mock.reset());

  describe("getList(): ", () => {
    const listResponse: MessagesListResponse = {
      data: [],
      total_count: 0,
      last_id: null,
    };

    it("lists messages in an inbox.", async () => {
      mock.onGet(messagesURL).reply(200, listResponse);

      const result = await messagesAPI.getList(42);

      expect(result).toEqual(listResponse);
    });

    it("passes last_id for pagination.", async () => {
      mock
        .onGet(`${messagesURL}?last_id=1700000000000123`)
        .reply(200, listResponse);

      const result = await messagesAPI.getList(42, {
        last_id: "1700000000000123",
      });

      expect(result).toEqual(listResponse);
    });
  });

  describe("get(): ", () => {
    it("returns a single message with body and attachment URLs.", async () => {
      const message = {
        id: "1700000000000123",
        raw_message_url: "https://storage.example.com/signed/eml/x?token=...",
      } as MessageDetails;

      mock.onGet(`${messagesURL}/1700000000000123`).reply(200, message);

      const result = await messagesAPI.get(42, "1700000000000123");

      expect(result).toEqual(message);
    });
  });

  describe("delete(): ", () => {
    it("deletes a message.", async () => {
      mock.onDelete(`${messagesURL}/1700000000000123`).reply(204);

      const result = await messagesAPI.delete(42, "1700000000000123");

      expect(result).toBeUndefined();
    });
  });

  const sendResult: SendMessageResult = {
    message_ids: ["1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"],
  };

  describe("reply(): ", () => {
    it("replies to a message.", async () => {
      const params = { text: "Thanks for reaching out." };

      mock
        .onPost(`${messagesURL}/1700000000000123/reply`, params)
        .reply(201, sendResult);

      const result = await messagesAPI.reply(42, "1700000000000123", params);

      expect(result).toEqual(sendResult);
    });
  });

  describe("replyAll(): ", () => {
    it("replies to all recipients.", async () => {
      const params = { text: "Thanks all." };

      mock
        .onPost(`${messagesURL}/1700000000000123/reply_all`, params)
        .reply(201, sendResult);

      const result = await messagesAPI.replyAll(42, "1700000000000123", params);

      expect(result).toEqual(sendResult);
    });
  });

  describe("forward(): ", () => {
    it("forwards a message.", async () => {
      const params: ForwardMessageParams = {
        to: [{ email: "colleague@example.com" }],
      };

      mock
        .onPost(`${messagesURL}/1700000000000123/forward`, params)
        .reply(201, sendResult);

      const result = await messagesAPI.forward(42, "1700000000000123", params);

      expect(result).toEqual(sendResult);
    });
  });
});
