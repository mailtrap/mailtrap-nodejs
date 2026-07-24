import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import EmailLogsApi from "../../../../lib/api/resources/EmailLogs";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import {
  EmailLogMessage,
  EmailLogsList,
  EmailLogMessageDetails,
} from "../../../../types/api/email-logs";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/EmailLogs: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const emailLogsAPI = new EmailLogsApi(axios, accountId);

  const mockMessage: EmailLogMessage = {
    message_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    status: "delivered",
    subject: "Welcome",
    rfc_message_id: "<abc@example.com>",
    in_reply_to: null,
    references: [],
    thread_id: null,
    from: "sender@example.com",
    to: "recipient@example.com",
    sent_at: "2025-01-15T10:30:00Z",
    client_ip: "203.0.113.42",
    category: "Welcome Email",
    custom_variables: {},
    sending_stream: "transactional",
    sending_domain_id: 3938,
    template_id: 100,
    template_variables: {},
    opens_count: 2,
    clicks_count: 1,
  };

  const mockListResponse: EmailLogsList = {
    messages: [mockMessage],
    total_count: 1,
    next_page_cursor: null,
  };

  const mockMessageDetails: EmailLogMessageDetails = {
    ...mockMessage,
    raw_message_url: "https://storage.example.com/signed/eml/abc?token=...",
    events: [
      {
        event_type: "click",
        created_at: "2025-01-15T10:35:00Z",
        details: {
          click_url: "https://example.com/track/click/abc123",
          web_ip_address: "198.51.100.50",
        },
      },
    ],
  };

  describe("class EmailLogsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(emailLogsAPI).toHaveProperty("getList");
        expect(emailLogsAPI).toHaveProperty("get");
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
    it("successfully gets email logs with no params.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, mockListResponse);
      const result = await emailLogsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(mockListResponse);
    });

    it("successfully gets email logs with search_after.", async () => {
      const searchAfter = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
      const baseUrl = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
      const expectedUrl = `${baseUrl}?search_after=a1b2c3d4-e5f6-7890-abcd-ef1234567890`;

      expect.assertions(2);

      mock.onGet(expectedUrl).reply(200, mockListResponse);
      const result = await emailLogsAPI.getList({ search_after: searchAfter });

      expect(mock.history.get[0].url).toEqual(expectedUrl);
      expect(result).toEqual(mockListResponse);
    });

    it("successfully gets email logs with filters (deepObject style).", async () => {
      const sentAfter = "2025-01-01T00:00:00Z";
      const sentBefore = "2025-01-31T23:59:59Z";
      const baseUrl = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
      const expectedQuery =
        "filters[sent_after]=2025-01-01T00%3A00%3A00Z" +
        "&filters[sent_before]=2025-01-31T23%3A59%3A59Z" +
        "&filters[to][operator]=ci_equal" +
        "&filters[to][value]=recipient%40example.com";
      const expectedUrl = `${baseUrl}?${expectedQuery}`;

      expect.assertions(2);

      mock.onGet(expectedUrl).reply(200, mockListResponse);
      const result = await emailLogsAPI.getList({
        filters: {
          sent_after: sentAfter,
          sent_before: sentBefore,
          to: { operator: "ci_equal", value: "recipient@example.com" },
        },
      });

      expect(mock.history.get[0].url).toEqual(expectedUrl);
      expect(result).toEqual(mockListResponse);
    });

    it("successfully gets email logs with filter value as array (e.g. category).", async () => {
      const baseUrl = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
      const expectedQuery =
        "filters[category][operator]=equal" +
        "&filters[category][value][]=Welcome%20Email" +
        "&filters[category][value][]=Forget%20Password";
      const expectedUrl = `${baseUrl}?${expectedQuery}`;

      expect.assertions(2);

      mock.onGet(expectedUrl).reply(200, mockListResponse);
      const result = await emailLogsAPI.getList({
        filters: {
          category: {
            operator: "equal",
            value: ["Welcome Email", "Forget Password"],
          },
        },
      });

      expect(mock.history.get[0].url).toEqual(expectedUrl);
      expect(result).toEqual(mockListResponse);
    });

    it("fails with unauthorized error (401).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
      const expectedErrorMessage = "Incorrect API token";

      expect.assertions(2);

      mock.onGet(endpoint).reply(401, { error: expectedErrorMessage });

      try {
        await emailLogsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with bad request (400).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
      const expectedErrorMessage = "Invalid request parameters";

      expect.assertions(2);

      mock.onGet(endpoint).reply(400, { errors: [expectedErrorMessage] });

      try {
        await emailLogsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with rate limit exceeded (429).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs`;
      const expectedErrorMessage = "Rate limit exceeded";

      expect.assertions(2);

      mock.onGet(endpoint).reply(429, { errors: [expectedErrorMessage] });

      try {
        await emailLogsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const messageId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

    it("successfully gets a single email log message by ID.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs/${messageId}`;

      expect.assertions(4);

      mock.onGet(endpoint).reply(200, mockMessageDetails);
      const result = await emailLogsAPI.get(messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(mockMessageDetails);
      expect(result.raw_message_url).toBeDefined();
      expect(result.events).toHaveLength(1);
    });

    it("fails with not found (404).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs/${messageId}`;
      const expectedErrorMessage = "Resource not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await emailLogsAPI.get(messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with rate limit exceeded (429).", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/email_logs/${messageId}`;
      const expectedErrorMessage = "Rate limit exceeded";

      expect.assertions(2);

      mock.onGet(endpoint).reply(429, { errors: [expectedErrorMessage] });

      try {
        await emailLogsAPI.get(messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
