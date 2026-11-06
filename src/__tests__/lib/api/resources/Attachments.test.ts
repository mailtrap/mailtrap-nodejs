import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Attachments from "../../../../lib/api/resources/Attachments";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Attachments: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const attachmentsAPI = new Attachments(axios, accountId);
  const responseData = {
    id: 1,
    message_id: 101,
    filename: "mock-filename",
    attachment_type: "mock-attachment_type",
    content_type: "mock-content_type",
    content_id: "mock-content_id",
    transfer_encoding: "mock-transfer_encoding",
    attachment_size: 2048,
    created_at: "mock-created_at",
    updated_at: "mock-updated_at",
    attachment_human_size: "mock-attachment_human_size",
    download_path: "mock-download_path",
  };
  const sandboxId = 1;
  const messageId = 1;
  const attachmentId = 100;

  describe("class Attachments(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(attachmentsAPI).toHaveProperty("get");
        expect(attachmentsAPI).toHaveProperty("getList");
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

  describe("getList(): ", () => {
    it("successfully gets list of attachments.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/attachments`;
      const expectedResponseData = [responseData];

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await attachmentsAPI.getList(sandboxId, messageId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await attachmentsAPI.getList(sandboxId, messageId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    it("successfully gets single attachment.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/messages/${messageId}/attachments/${attachmentId}`;

      mock.onGet(endpoint).reply(200, responseData);
      const result = await attachmentsAPI.get(
        sandboxId,
        messageId,
        attachmentId
      );

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await attachmentsAPI.get(sandboxId, messageId, attachmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
