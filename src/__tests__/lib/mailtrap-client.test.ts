/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
import axios, { AxiosError } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { Mail, MailtrapClient } from "../..";
import MailtrapError from "../../lib/MailtrapError";

import CONFIG from "../../config";
import GeneralAPI from "../../lib/api/General";
import TestingAPI from "../../lib/api/Testing";
import ContactLists from "../../lib/api/ContactLists";
import Contacts from "../../lib/api/Contacts";
import ContactExportsBaseAPI from "../../lib/api/ContactExports";
import TemplatesBaseAPI from "../../lib/api/Templates";
import SuppressionsBaseAPI from "../../lib/api/Suppressions";
import SendingDomainsBaseAPI from "../../lib/api/SendingDomains";
import EmailLogsBaseAPI from "../../lib/api/EmailLogs";
import ContactEventsBaseAPI from "../../lib/api/ContactEvents";

const { ERRORS, CLIENT_SETTINGS } = CONFIG;
const { TESTING_ENDPOINT, BULK_ENDPOINT, SENDING_ENDPOINT } = CLIENT_SETTINGS;
const { ACCOUNT_ID_MISSING, BULK_SANDBOX_INCOMPATIBLE, TEST_INBOX_ID_MISSING } =
  ERRORS;

describe("lib/mailtrap-client: ", () => {
  let mock: AxiosMockAdapter;

  const goodMail: Mail = {
    from: {
      name: "Mailtrap",
      email: "sender@mailtrap.io",
    },
    to: [
      {
        email: "recipient@mailtrap.io",
      },
    ],
    subject: "My Subject",
    text: "My TEXT",
  };

  describe("send():", () => {
    beforeAll(() => {
      mock = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
      mock.reset();
    });

    it("rejects with Mailtrap error, bulk and sanbox modes are incompatible.", async () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        bulk: true,
        sandbox: true,
      });

      try {
        await client.send(goodMail);
      } catch (error) {
        expect(error).toEqual(new MailtrapError(BULK_SANDBOX_INCOMPATIBLE));
      }
    });
    const testInboxId = 100;

    it("successfully sends testing email.", async () => {
      const testingClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId,
      });
      const endpoint = `${TESTING_ENDPOINT}/api/send/${testInboxId}`;
      const expectedResponseData = {
        success: true,
        message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
      };
      mock.onPost(endpoint).reply(200, expectedResponseData);

      const emailData = {
        from: {
          email: "sender.mock@email.com",
          name: "sender",
        },
        to: [
          {
            email: "recipient.mock@email.com",
            name: "recipient",
          },
        ],
        subject: "mock-subject",
        text: "Mock text",
        html: "<div>Mock text</div>",
      };

      const result = await testingClient.send(emailData);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully sends bulk email.", async () => {
      const bulkClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        bulk: true,
      });
      const endpoint = `${BULK_ENDPOINT}/api/send`;
      const expectedResponseData = {
        success: true,
        message_ids: ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"],
      };
      mock.onPost(endpoint).reply(200, expectedResponseData);

      const emailData = {
        from: {
          email: "sender.mock@email.com",
          name: "sender",
        },
        to: [
          {
            email: "recipient.mock@email.com",
            name: "recipient",
          },
        ],
        subject: "mock-subject",
        text: "Mock text",
        html: "<div>Mock text</div>",
      };

      const result = await bulkClient.send(emailData);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));
      expect(result).toEqual(expectedResponseData);
    });

    it("handles an API error.", async () => {
      const testingClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId,
      });
      const responseData = {
        success: false,
        errors: ["mock-error-1", "mock-error-2"],
      };

      const endpoint = `${TESTING_ENDPOINT}/api/send/${testInboxId}`;

      mock.onPost(endpoint).reply(400, responseData);

      const emailData = {
        from: {
          email: "sender.mock@email.com",
          name: "sender",
        },
        to: [
          {
            email: "recipient.mock@email.com",
            name: "recipient",
          },
        ],
        subject: "mock-subject",
        text: "Mock text",
        html: "<div>Mock text</div>",
      };

      const expectedErrorMessage = responseData.errors.join(",");

      expect.assertions(3);

      try {
        await testingClient.send(emailData);
      } catch (error) {
        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(JSON.stringify(emailData));

        if (error instanceof Error) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("handles an HTTP transport error.", async () => {
      const testingClient = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        testInboxId,
      });
      const emailData = {
        from: {
          email: "sender.mock@email.com",
          name: "sender",
        },
        to: [
          {
            email: "recipient.mock@email.com",
            name: "recipient",
          },
        ],
        subject: "mock-subject",
        text: "Mock text",
        html: "<div>Mock text</div>",
      };

      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await testingClient.send(emailData);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("sends request to mailtrap api", async () => {
      const successData = {
        success: "true",
        message_ids: ["00000000-00000000-00000000-00000001"],
      };
      const endpoint = `${SENDING_ENDPOINT}/api/send`;

      mock.onPost(endpoint).reply(200, successData);

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });
      const result = await client.send(goodMail);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(mock.history.post[0].headers).toMatchObject({
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer MY_API_TOKEN",
        Connection: "keep-alive",
        "User-Agent":
          "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
      });
      expect(mock.history.post[0].data).toEqual(
        "{" +
          '"from":{"name":"Mailtrap","email":"sender@mailtrap.io"},' +
          '"to":[{"email":"recipient@mailtrap.io"}],' +
          '"subject":"My Subject",' +
          '"text":"My TEXT"' +
          "}"
      );
      expect(result).toEqual(successData);
    });

    it("sends request to mailtrap api with template", async () => {
      const successData = {
        success: "true",
        message_ids: ["00000000-00000000-00000000-00000001"],
      };

      mock
        .onPost("https://send.api.mailtrap.io/api/send")
        .reply(200, successData);

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });
      const result = await client.send({
        from: {
          name: "Mailtrap",
          email: "sender@mailtrap.io",
        },
        to: [
          {
            email: "recipient@mailtrap.io",
          },
        ],
        template_uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
        template_variables: {
          user_name: "John Doe",
        },
      });

      expect(mock.history.post[0].url).toEqual(
        "https://send.api.mailtrap.io/api/send"
      );
      expect(mock.history.post[0].headers).toMatchObject({
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: "Bearer MY_API_TOKEN",
        Connection: "keep-alive",
        "User-Agent":
          "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
      });
      expect(mock.history.post[0].data).toEqual(
        "{" +
          '"from":{"name":"Mailtrap","email":"sender@mailtrap.io"},' +
          '"to":[{"email":"recipient@mailtrap.io"}],' +
          '"template_uuid":"813e39db-c74a-4830-b037-0e6ba8b1fe88",' +
          '"template_variables":{"user_name":"John Doe"}' +
          "}"
      );
      expect(result).toEqual(successData);
    });

    it("throws error returned from the server", async () => {
      mock.onPost("https://send.api.mailtrap.io/api/send").reply(400, {
        success: false,
        errors: ["subject is missing", "message is missing"],
      });

      const client = new MailtrapClient({ token: "MY_API_TOKEN" });

      try {
        await client.send(goodMail);
      } catch (err) {
        expect(err).toBeInstanceOf(MailtrapError);
        if (err instanceof MailtrapError) {
          expect(err.message).toEqual("subject is missing,message is missing");
          // @ts-expect-error ES5 types don't know about cause property
          expect(err.cause).toBeInstanceOf(AxiosError);
        }
      }
    });

    it("wraps other network errors", async () => {
      // don't provide mocks, to generate 404 error
      const client = new MailtrapClient({ token: "MY_API_TOKEN" });

      try {
        await client.send(goodMail);
      } catch (err) {
        expect(err).toBeInstanceOf(MailtrapError);
        if (err instanceof MailtrapError) {
          expect(err.message).toEqual("Request failed with status code 404");
          // @ts-expect-error ES5 types don't know about cause property
          expect(err.cause).toBeInstanceOf(AxiosError);
        }
      }
    });

    it("throws MailtrapError(TEST_INBOX_ID_MISSING) when sending in sandbox mode without testInboxId", async () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        sandbox: true,
        accountId: 123,
      });

      await expect(
        client.send({
          from: { email: "a@b.com", name: "Sender" },
          to: [{ email: "c@d.com" }],
          subject: "Test",
          text: "Body",
        })
      ).rejects.toEqual(new MailtrapError(TEST_INBOX_ID_MISSING));
    });

    describe("batch sending:", () => {
      it("throws MailtrapError(TEST_INBOX_ID_MISSING) when batch sending in sandbox mode without testInboxId", async () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          sandbox: true,
          accountId: 123,
        });

        const batchData = {
          base: {
            from: { email: "a@b.com", name: "Sender" },
            subject: "Test",
            text: "Body",
          },
          requests: [
            {
              to: [{ email: "c@d.com" }],
            },
          ],
        };

        await expect(client.batchSend(batchData)).rejects.toEqual(
          new MailtrapError(TEST_INBOX_ID_MISSING)
        );
      });

      it("rejects with Mailtrap error when bulk and sandbox modes are used together", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
          sandbox: true,
        });

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
          ],
        };

        try {
          await batchClient.batchSend(batchData);
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);
          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(BULK_SANDBOX_INCOMPATIBLE);
          }
        }
      });

      it("successfully sends a batch of emails in bulk mode", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const endpoint = `${BULK_ENDPOINT}/api/batch`;
        const expectedBatchResponseData = {
          success: true,
          responses: [
            {
              success: true,
              message_ids: ["57f17fe0-3935-11f0-0000-f15507b34198"],
            },
            {
              success: true,
              message_ids: ["57f17fe0-3935-11f0-0000-f15507b34199"],
            },
          ],
        };
        mock.onPost(endpoint).reply(200, expectedBatchResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedBatchResponseData);
      });

      it("successfully sends a batch of emails in sandbox mode", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          sandbox: true,
          testInboxId: 100,
        });
        const endpoint = `${TESTING_ENDPOINT}/api/batch/100`;
        const expectedBatchResponseData = {
          success: true,
          responses: [
            {
              success: true,
              message_ids: ["57f17fe0-3935-11f0-0000-f15507b34198"],
            },
          ],
        };
        mock.onPost(endpoint).reply(200, expectedBatchResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Batch Subject",
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedBatchResponseData);
      });

      it("successfully sends a batch of emails with template", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const endpoint = `${BULK_ENDPOINT}/api/batch`;
        const expectedBatchResponseData = {
          success: true,
          responses: [
            {
              success: true,
              message_ids: ["57f17fe0-3935-11f0-0000-f15507b34198"],
            },
          ],
        };
        mock.onPost(endpoint).reply(200, expectedBatchResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            template_uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
            template_variables: {
              company_name: "Mailtrap",
            },
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedBatchResponseData);
      });

      it("successfully sends a batch of transactional emails", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        const endpoint = `${SENDING_ENDPOINT}/api/batch`;
        const expectedBatchResponseData = {
          success: true,
          responses: [
            {
              success: true,
              message_ids: ["1cc512a0-3936-11f0-0040-f1a6f440b26b"], // First recipient
            },
            {
              success: true,
              message_ids: ["1cc47660-3936-11f0-0040-f1a6f440b26b"], // Second recipient
            },
          ],
        };
        mock.onPost(endpoint).reply(200, expectedBatchResponseData);

        const batchData = {
          base: {
            from: {
              email: "sender@mailtrap.io",
              name: "Mailtrap",
            },
            subject: "Transactional Batch Subject",
            text: "Transactional Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
            {
              to: [
                {
                  email: "recipient2.mock@email.com",
                  name: "recipient2",
                },
              ],
            },
          ],
        };

        const result = await batchClient.batchSend(batchData);

        expect(mock.history.post[0].url).toEqual(endpoint);
        expect(mock.history.post[0].data).toEqual(
          JSON.stringify({
            base: batchData.base,
            requests: batchData.requests.map((req) => ({
              to: req.to,
            })),
          })
        );
        expect(result).toEqual(expectedBatchResponseData);
      });

      it("handles API errors for batch sending", async () => {
        const batchClient = new MailtrapClient({
          token: "MY_API_TOKEN",
          bulk: true,
        });
        const endpoint = `${BULK_ENDPOINT}/api/batch`;
        const responseData = {
          success: true,
          responses: [
            {
              success: false,
              errors: ["'from' is required", "'subject' is required"],
            },
          ],
        };
        mock.onPost(endpoint).reply(200, responseData);

        const batchData = {
          base: {
            text: "Batch Text",
          },
          requests: [
            {
              to: [
                {
                  email: "recipient1.mock@email.com",
                  name: "recipient1",
                },
              ],
            },
          ],
        };

        // @ts-ignore
        const result = await batchClient.batchSend(batchData);
        expect(result).toEqual(responseData);
        expect(result.responses[0].success).toBe(false);
        expect(result.responses[0].errors).toContain("'from' is required");
        expect(result.responses[0].errors).toContain("'subject' is required");
      });
    });
  });

  describe("get testing(): ", () => {
    it("rejects with Mailtrap error, when `accountId` is missing.", () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
      });

      expect.assertions(1);

      try {
        client.testing;
      } catch (error) {
        expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
      }
    });

    it("returns testing API object when accountId is provided, even without testInboxId", () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        accountId: 123,
        // testInboxId is intentionally omitted
      });
      expect.assertions(1);

      const testingClient = client.testing;
      expect(testingClient).toBeInstanceOf(TestingAPI);
    });

    it("returns testing API object, console warn is called twice.", () => {
      const client = new MailtrapClient({
        token: "MY_API_TOKEN",
        accountId: 10,
      });
      expect.assertions(1);

      const testingClient = client.testing;
      expect(testingClient).toBeInstanceOf(TestingAPI);
    });

    describe("get general(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.general;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns general API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const generalClient = client.general;
        expect(generalClient).toBeInstanceOf(GeneralAPI);
      });
    });

    describe("get contacts(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.contacts;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns contacts API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const contactsClient = client.contacts;
        expect(contactsClient).toBeInstanceOf(Contacts);
      });
    });

    describe("get contactLists(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.contactLists;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns contact lists API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const contactListsClient = client.contactLists;
        expect(contactListsClient).toBeInstanceOf(ContactLists);
      });
    });

    describe("get contactExports(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.contactExports;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns contact exports API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const contactExportsClient = client.contactExports;
        expect(contactExportsClient).toBeInstanceOf(ContactExportsBaseAPI);
      });
    });

    describe("get templates(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.templates;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns templates API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const templatesClient = client.templates;
        expect(templatesClient).toBeInstanceOf(TemplatesBaseAPI);
      });
    });

    describe("get suppressions(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.suppressions;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns suppressions API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const suppressionsClient = client.suppressions;
        expect(suppressionsClient).toBeInstanceOf(SuppressionsBaseAPI);
      });
    });

    describe("get sendingDomains(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        expect.assertions(1);

        const client = new MailtrapClient({
          token: "test-token",
        });

        expect(() => client.sendingDomains).toThrow(
          "accountId is missing, please provide a valid accountId."
        );
      });

      it("returns sending domains API object when accountId is provided.", () => {
        expect.assertions(1);

        const client = new MailtrapClient({
          token: "test-token",
          accountId: 123,
        });

        const sendingDomainsClient = client.sendingDomains;
        expect(sendingDomainsClient).toBeInstanceOf(SendingDomainsBaseAPI);
      });
    });

    describe("get emailLogs(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        expect.assertions(1);

        const client = new MailtrapClient({
          token: "test-token",
        });

        expect(() => client.emailLogs).toThrow(
          "accountId is missing, please provide a valid accountId."
        );
      });

      it("returns email logs API object when accountId is provided.", () => {
        expect.assertions(1);

        const client = new MailtrapClient({
          token: "test-token",
          accountId: 123,
        });

        const emailLogsClient = client.emailLogs;
        expect(emailLogsClient).toBeInstanceOf(EmailLogsBaseAPI);
      });
    });

    describe("get contactEvents(): ", () => {
      it("rejects with Mailtrap error, when `accountId` is missing.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
        });
        expect.assertions(1);

        try {
          client.contactEvents;
        } catch (error) {
          expect(error).toEqual(new MailtrapError(ACCOUNT_ID_MISSING));
        }
      });

      it("returns contact events API object when accountId is provided.", () => {
        const client = new MailtrapClient({
          token: "MY_API_TOKEN",
          accountId: 10,
        });
        expect.assertions(1);

        const contactEventsClient = client.contactEvents;
        expect(contactEventsClient).toBeInstanceOf(ContactEventsBaseAPI);
      });
    });
  });
});
