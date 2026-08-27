import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import SuppressionsApi from "../../../../lib/api/resources/Suppressions";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import { Suppression } from "../../../../types/api/suppressions";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Suppressions: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const suppressionsAPI = new SuppressionsApi(axios, accountId);

  const mockSuppression: Suppression = {
    id: "1",
    email: "test@example.com",
    type: "hard bounce",
    created_at: "2023-01-01T00:00:00Z",
    sending_stream: "transactional",
    domain_name: "example.com",
    message_bounce_category: "bad_mailbox",
    message_category: "test",
    message_client_ip: "192.168.1.1",
    message_created_at: "2023-01-01T00:00:00Z",
    message_esp_response: null,
    message_esp_server_type: null,
    message_outgoing_ip: "10.0.0.1",
    message_recipient_mx_name: "mx.example.com",
    message_sender_email: "sender@example.com",
    message_subject: "Test Email",
  };

  const mockSuppressions: Suppression[] = [
    {
      id: "1",
      email: "test1@example.com",
      type: "hard bounce",
      created_at: "2023-01-01T00:00:00Z",
      sending_stream: "transactional",
      domain_name: "example.com",
      message_bounce_category: "bad_mailbox",
      message_category: "test",
      message_client_ip: "192.168.1.1",
      message_created_at: "2023-01-01T00:00:00Z",
      message_esp_response: null,
      message_esp_server_type: null,
      message_outgoing_ip: "10.0.0.1",
      message_recipient_mx_name: "mx.example.com",
      message_sender_email: "sender@example.com",
      message_subject: "Test Email 1",
    },
    {
      id: "2",
      email: "test2@example.com",
      type: "spam complaint",
      created_at: "2023-01-02T00:00:00Z",
      sending_stream: "bulk",
      domain_name: "example.com",
      message_bounce_category: null,
      message_category: "promotional",
      message_client_ip: "192.168.1.2",
      message_created_at: "2023-01-02T00:00:00Z",
      message_esp_response: null,
      message_esp_server_type: null,
      message_outgoing_ip: "10.0.0.2",
      message_recipient_mx_name: "mx.example.com",
      message_sender_email: "sender@example.com",
      message_subject: "Test Email 2",
    },
  ];

  describe("class SuppressionsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(suppressionsAPI).toHaveProperty("getList");
        expect(suppressionsAPI).toHaveProperty("create");
        expect(suppressionsAPI).toHaveProperty("delete");
      });
    });
  });

  beforeAll(() => {
    axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("getList(): ", () => {
    it("successfully gets suppressions (up to 1000 per request).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, mockSuppressions);
      const result = await suppressionsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(mockSuppressions);
    });

    it("successfully gets suppressions filtered by email.", async () => {
      const email = "test@example.com";
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;

      expect.assertions(3);

      mock.onGet(endpoint, { params: { email } }).reply(200, [mockSuppression]);
      const result = await suppressionsAPI.getList({ email });

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({ email });
      expect(result).toEqual([mockSuppression]);
    });

    it("fails with unauthorized error (401).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;
      const expectedErrorMessage = "Incorrect API token";

      expect.assertions(2);

      mock.onGet(endpoint).reply(401, { error: expectedErrorMessage });

      try {
        await suppressionsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with forbidden error (403).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;
      const expectedErrorMessage = "Access forbidden";

      expect.assertions(2);

      mock.onGet(endpoint).reply(403, { errors: expectedErrorMessage });

      try {
        await suppressionsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions`;

    it("sends a flat body and returns the wrapped suppression.", async () => {
      const params = {
        email: "test@example.com",
        domain_id: 12345,
        sending_stream: "transactional" as const,
      };
      const expectedResponse = { data: mockSuppression };

      expect.assertions(2);

      mock.onPost(endpoint).reply(201, expectedResponse);
      const result = await suppressionsAPI.create(params);

      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
      expect(result).toEqual(expectedResponse);
    });

    it("sends the optional type when provided.", async () => {
      const params = {
        email: "test@example.com",
        domain_id: 12345,
        sending_stream: "bulk" as const,
        type: "spam complaint" as const,
      };

      expect.assertions(1);

      mock.onPost(endpoint).reply(201, { data: mockSuppression });
      await suppressionsAPI.create(params);

      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
    });

    it("fails with unauthorized error (401).", async () => {
      const expectedErrorMessage = "Incorrect API token";

      expect.assertions(2);

      mock.onPost(endpoint).reply(401, { error: expectedErrorMessage });

      try {
        await suppressionsAPI.create({
          email: "test@example.com",
          domain_id: 12345,
          sending_stream: "transactional",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const suppressionId = "1";

    it("successfully deletes a suppression.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions/${suppressionId}`;

      expect.assertions(1);

      mock.onDelete(endpoint).reply(204);
      await suppressionsAPI.delete(suppressionId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
    });

    it("fails with unauthorized error (401).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions/${suppressionId}`;
      const expectedErrorMessage = "Incorrect API token";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(401, { error: expectedErrorMessage });

      try {
        await suppressionsAPI.delete(suppressionId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with forbidden error (403).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/suppressions/${suppressionId}`;
      const expectedErrorMessage = "Access forbidden";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(403, { errors: expectedErrorMessage });

      try {
        await suppressionsAPI.delete(suppressionId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
