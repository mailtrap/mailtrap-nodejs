import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Messages from "../../../../lib/api/resources/Messages";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Messages: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const messagesAPI = new Messages(axios, accountId);
  const sandboxId = 1;
  const messageId = 1;
  const responseData = {
    id: 1,
    inbox_id: 101,
    subject: "mock-subject",
    sent_at: "2023-11-17T08:30:00Z",
    from_email: "sender@example.com",
    from_name: "John Doe",
    to_email: "receiver@example.com",
    to_name: "Jane Smith",
    email_size: 2048,
    is_read: false,
    created_at: "2023-11-17T08:45:00Z",
    updated_at: "2023-11-17T08:45:00Z",
    html_body_size: 1024,
    text_body_size: 512,
    human_size: "2 KB",
    html_path: "mock-html_path",
    txt_path: "mock-txt_path",
    raw_path: "mock-raw_path",
    download_path: "mock-download",
    html_source_path: "mock-html-source",
    blacklists_report_info: true,
    smtp_information: {
      ok: true,
    },
  };

  describe("class Messages(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(messagesAPI).toHaveProperty("deleteMessage");
        expect(messagesAPI).toHaveProperty("forward");
        expect(messagesAPI).toHaveProperty("get");
        expect(messagesAPI).toHaveProperty("getHtmlAnalysis");
        expect(messagesAPI).toHaveProperty("getHtmlMessage");
        expect(messagesAPI).toHaveProperty("getMailHeaders");
        expect(messagesAPI).toHaveProperty("getMessageAsEml");
        expect(messagesAPI).toHaveProperty("getMessageHtmlSource");
        expect(messagesAPI).toHaveProperty("getRawMessage");
        expect(messagesAPI).toHaveProperty("getSpamScore");
        expect(messagesAPI).toHaveProperty("getTextMessage");
        expect(messagesAPI).toHaveProperty("showEmailMessage");
        expect(messagesAPI).toHaveProperty("updateMessage");
      });
    });
  });

  beforeAll(() => {
    /**
     * Init Axios interceptors for handling response.data, errors.
     */
    axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("showEmailMessage(): ", () => {
    it("successfully deletes message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}`;

      mock.onGet(endpoint).reply(200, responseData);

      const result = await messagesAPI.showEmailMessage(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.showEmailMessage(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("updateMessage(): ", () => {
    it("successfully updates message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await messagesAPI.updateMessage(sandboxId, messageId, {
        isRead: true,
      });

      const expectedData = { message: { is_read: true } };
      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toEqual(JSON.stringify(expectedData));
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.updateMessage(sandboxId, messageId, {
          isRead: true,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("deleteMessage(): ", () => {
    it("successfully deletes message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}`;

      mock.onDelete(endpoint).reply(200, responseData);

      const result = await messagesAPI.deleteMessage(sandboxId, messageId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
      expect(mock.history.delete[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.deleteMessage(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    it("successfully gets all messages.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages`;
      const expectedResponseData = [responseData];

      mock.onGet(endpoint).reply(200, expectedResponseData);

      const result = await messagesAPI.get(sandboxId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets messages with last_id parameter.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages`;
      const lastId = 100;
      const expectedResponseData = [responseData];

      mock
        .onGet(endpoint, { params: { last_id: lastId } })
        .reply(200, expectedResponseData);

      const result = await messagesAPI.get(sandboxId, { last_id: lastId });

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({ last_id: lastId });
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets messages with page parameter.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages`;
      const page = 2;
      const expectedResponseData = [responseData];

      mock
        .onGet(endpoint, { params: { page } })
        .reply(200, expectedResponseData);

      const result = await messagesAPI.get(sandboxId, { page });

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({ page });
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets messages with search parameter.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages`;
      const search = "test query";
      const expectedResponseData = [responseData];

      mock
        .onGet(endpoint, { params: { search } })
        .reply(200, expectedResponseData);

      const result = await messagesAPI.get(sandboxId, { search });

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({ search });
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets messages with all query parameters.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages`;
      const options = { last_id: 100, page: 2, search: "test query" };
      const expectedResponseData = [responseData];

      mock
        .onGet(endpoint, { params: options })
        .reply(200, expectedResponseData);

      const result = await messagesAPI.get(sandboxId, options);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual(options);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.get(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("forward(): ", () => {
    const emailToForward = "mock@emailtoforward.com";

    it("successfully forwards message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/forward`;

      mock.onPost(endpoint).reply(200, responseData);

      const result = await messagesAPI.forward(
        sandboxId,
        messageId,
        emailToForward
      );

      const body = { email: emailToForward };

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(body));
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.forward(sandboxId, messageId, emailToForward);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getSpamScore(): ", () => {
    const spamReportData = {
      ResponseCode: 200,
      ResponseMessage: "OK",
      ResponseVersion: "1.0",
      Score: 8.5,
      Spam: true,
      Threshold: 7,
      Details: [],
    };

    it("successfully gets message spam score.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/spam_report`;

      mock.onGet(endpoint).reply(200, spamReportData);

      const result = await messagesAPI.getSpamScore(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(spamReportData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getSpamScore(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getHtmlAnalysis(): ", () => {
    const htmlReportData = {
      status: "success",
      errors: [],
    };

    it("successfully gets html analysis.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/analyze`;

      mock.onGet(endpoint).reply(200, htmlReportData);

      const result = await messagesAPI.getHtmlAnalysis(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(htmlReportData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getHtmlAnalysis(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getTextMessage(): ", () => {
    it("successfully gets text message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/body.txt`;
      const message = "mock-message";
      mock.onGet(endpoint).reply(200, message);

      const result = await messagesAPI.getTextMessage(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(message);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getTextMessage(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getRawMessage(): ", () => {
    it("successfully gets raw message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/body.raw`;
      const message = "mock-message";
      mock.onGet(endpoint).reply(200, message);

      const result = await messagesAPI.getRawMessage(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(message);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getRawMessage(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getMessageHtmlSource(): ", () => {
    it("successfully gets html source.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/body.htmlsource`;
      const htmlSource = "mock-htmlSource";
      mock.onGet(endpoint).reply(200, htmlSource);

      const result = await messagesAPI.getMessageHtmlSource(
        sandboxId,
        messageId
      );

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(htmlSource);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getMessageHtmlSource(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getHtmlMessage(): ", () => {
    it("successfully gets html message.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/body.html`;
      const html = "<div>interesting mock</div>";
      mock.onGet(endpoint).reply(200, html);

      const result = await messagesAPI.getHtmlMessage(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(html);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getHtmlMessage(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getMessageAsEml(): ", () => {
    it("successfully gets mail headers.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/body.eml`;
      const eml = "mock-eml";
      mock.onGet(endpoint).reply(200, eml);

      const result = await messagesAPI.getMessageAsEml(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(eml);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getMessageAsEml(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getMailHeaders(): ", () => {
    it("successfully gets message html source.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/mail_headers`;
      const eml = "mock-eml";
      mock.onGet(endpoint).reply(200, eml);

      const result = await messagesAPI.getMailHeaders(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(eml);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await messagesAPI.getMailHeaders(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
