import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Sandboxes from "../../../../lib/api/resources/Sandboxes";
import InboxesApi from "../../../../lib/api/resources/Inboxes";
import warnDeprecated from "../../../../lib/deprecation";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";
import { Inbox } from "../../../../types/api/inboxes";

jest.mock("../../../../lib/deprecation");

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Sandboxes: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const sandboxesAPI = new Sandboxes(axios, accountId);
  const responseData = {
    id: 10,
    name: "mock-name",
    username: "mock-username",
    password: "mock-password",
    max_size: 10,
    status: "mock-status",
    email_username: "mock-email_username",
    email_username_enabled: false,
    sent_messages_count: 10,
    forwarded_messages_count: 10,
    used: false,
    forward_from_email_address: "mock-forward_from_email_address",
    project_id: 10,
    domain: "mock-domain",
    pop3_domain: "mock-pop3_domain",
    email_domain: "mock-email_domain",
    smtp_ports: [],
    pop3_ports: [],
    emails_count: 10,
    emails_unread_count: 10,
    last_message_sent_at: null,
    max_message_size: 10,
    permissions: [],
  };

  describe("class Sandboxes(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(sandboxesAPI).toHaveProperty("cleanSandbox");
        expect(sandboxesAPI).toHaveProperty("create");
        expect(sandboxesAPI).toHaveProperty("delete");
        expect(sandboxesAPI).toHaveProperty("enableEmailAddress");
        expect(sandboxesAPI).toHaveProperty("getSandboxAttributes");
        expect(sandboxesAPI).toHaveProperty("getList");
        expect(sandboxesAPI).toHaveProperty("markAsRead");
        expect(sandboxesAPI).toHaveProperty("resetCredentials");
        expect(sandboxesAPI).toHaveProperty("resetEmailAddress");
        expect(sandboxesAPI).toHaveProperty("updateSandbox");
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

  describe("create(): ", () => {
    it("successfully creates project.", async () => {
      const projectId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/projects/${projectId}/inboxes`;

      mock.onPost(endpoint).reply(200, responseData);
      const sandboxName = "mock-sandboxName";
      const result = await sandboxesAPI.create(projectId, sandboxName);

      const sentData = { inbox: { name: sandboxName } };

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(sentData));
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const projectId = 1;
      const sandboxName = "mock-sandboxName";
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.create(projectId, sandboxName);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    describe("updateSandbox(): ", () => {
      it("succesfully updates sandbox.", async () => {
        const sandboxId = 1;
        const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}`;

        mock.onPatch(endpoint).reply(200, responseData);
        const name = "mock-sandboxName";
        const emailUsername = "mock@email.com";
        const result = await sandboxesAPI.updateSandbox(sandboxId, {
          name,
          emailUsername,
        });

        const sentData = {
          inbox: {
            name,
            email_username: emailUsername,
          },
        };

        expect(mock.history.patch[0].url).toEqual(endpoint);
        expect(mock.history.patch[0].data).toEqual(JSON.stringify(sentData));
        expect(result).toEqual(responseData);
      });

      it("fails with error", async () => {
        const sandboxId = 1;
        const expectedErrorMessage = "Request failed with status code 404";

        const name = "mock-sandboxName";
        const emailUsername = "mock@email.com";

        expect.assertions(2);

        try {
          await sandboxesAPI.updateSandbox(sandboxId, {
            name,
            emailUsername,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);

          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });
    });

    describe("getSandboxAttributes(): ", () => {
      it("succesfully gets sandbox attributes.", async () => {
        const sandboxId = 1;
        const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}`;

        mock.onGet(endpoint).reply(200, responseData);

        const result = await sandboxesAPI.getSandboxAttributes(sandboxId);

        expect(mock.history.get[0].url).toEqual(endpoint);
        expect(result).toEqual(responseData);
      });

      it("fails with error", async () => {
        const sandboxId = 1;
        const expectedErrorMessage = "Request failed with status code 404";

        expect.assertions(2);

        try {
          await sandboxesAPI.getSandboxAttributes(sandboxId);
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);

          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(expectedErrorMessage);
          }
        }
      });
    });
  });

  describe("delete(): ", () => {
    it("succesfully deletes sandbox.", async () => {
      const sandboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}`;

      mock.onDelete(endpoint).reply(200, responseData);

      const result = await sandboxesAPI.delete(sandboxId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const sandboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.delete(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("cleanSandbox(): ", () => {
    it("succesfully cleans sandbox.", async () => {
      const sandboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/clean`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await sandboxesAPI.cleanSandbox(sandboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const sandboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.cleanSandbox(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("markAsRead(): ", () => {
    it("succesfully marks sandbox as read.", async () => {
      const sandboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/all_read`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await sandboxesAPI.markAsRead(sandboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const sandboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.markAsRead(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("resetCredentials(): ", () => {
    it("succesfully resets credentials.", async () => {
      const sandboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/reset_credentials`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await sandboxesAPI.resetCredentials(sandboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const sandboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.resetCredentials(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("enableEmailAddress(): ", () => {
    it("succesfully toggles email availability.", async () => {
      const sandboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/toggle_email_username`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await sandboxesAPI.enableEmailAddress(sandboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const sandboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.enableEmailAddress(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("resetEmailAddress(): ", () => {
    it("succesfully resets email address.", async () => {
      const sandboxId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}/reset_email_username`;

      mock.onPatch(endpoint).reply(200, responseData);

      const result = await sandboxesAPI.resetEmailAddress(sandboxId);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(mock.history.patch[0].data).toBeUndefined();
      expect(result).toEqual(responseData);
    });

    it("fails with error", async () => {
      const sandboxId = 1;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.resetEmailAddress(sandboxId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getList(): ", () => {
    it("succesfully gets sandbox list.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes`;

      const expectedResponseData = [responseData];

      mock.onGet(endpoint).reply(200, expectedResponseData);

      const result = await sandboxesAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await sandboxesAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("class InboxesApi() (deprecated): ", () => {
    const inboxesAPI = new InboxesApi(axios, accountId);
    const sandboxId = 1;
    const sandboxURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/inboxes/${sandboxId}`;

    it("keeps the SandboxesApi methods.", () => {
      expect(inboxesAPI).toBeInstanceOf(Sandboxes);
    });

    it("getInboxAttributes() delegates to getSandboxAttributes() and warns.", async () => {
      mock.onGet(sandboxURL).reply(200, responseData);

      const result: Inbox = await inboxesAPI.getInboxAttributes(sandboxId);

      expect(mock.history.get[0].url).toEqual(sandboxURL);
      expect(result).toEqual(responseData);
      expect(warnDeprecated).toHaveBeenCalledWith(
        "client.testing.inboxes.getInboxAttributes",
        "client.sandbox.sandboxes.getSandboxAttributes"
      );
    });

    it("updateInbox() delegates to updateSandbox() and warns.", async () => {
      mock.onPatch(sandboxURL).reply(200, responseData);

      const result = await inboxesAPI.updateInbox(sandboxId, {
        name: "mock-sandboxName",
        emailUsername: "mock",
      });

      expect(mock.history.patch[0].data).toEqual(
        JSON.stringify({
          inbox: { name: "mock-sandboxName", email_username: "mock" },
        })
      );
      expect(result).toEqual(responseData);
      expect(warnDeprecated).toHaveBeenCalledWith(
        "client.testing.inboxes.updateInbox",
        "client.sandbox.sandboxes.updateSandbox"
      );
    });

    it("cleanInbox() delegates to cleanSandbox() and warns.", async () => {
      mock.onPatch(`${sandboxURL}/clean`).reply(200, responseData);

      const result = await inboxesAPI.cleanInbox(sandboxId);

      expect(result).toEqual(responseData);
      expect(warnDeprecated).toHaveBeenCalledWith(
        "client.testing.inboxes.cleanInbox",
        "client.sandbox.sandboxes.cleanSandbox"
      );
    });
  });
});
