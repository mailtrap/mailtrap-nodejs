import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import WebhooksApi from "../../../../lib/api/resources/Webhooks";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Webhooks: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const webhooksAPI = new WebhooksApi(axios, accountId);

  describe("class WebhooksApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(webhooksAPI).toHaveProperty("getList");
        expect(webhooksAPI).toHaveProperty("create");
        expect(webhooksAPI).toHaveProperty("get");
        expect(webhooksAPI).toHaveProperty("update");
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
    const responseData = {
      data: [
        {
          id: 1,
          url: "https://example.com/mailtrap/webhooks",
          active: true,
          webhook_type: "email_sending",
          payload_format: "json",
          sending_stream: "transactional",
          domain_id: 435,
          event_types: ["delivery", "bounce"],
        },
        {
          id: 2,
          url: "https://example.com/mailtrap/webhooks",
          active: true,
          webhook_type: "audit_log",
          payload_format: "json",
        },
      ],
    };

    it("gets the list of webhooks.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/webhooks`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await webhooksAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await webhooksAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    const params = {
      url: "https://example.com/mailtrap/webhooks",
      webhook_type: "email_sending" as const,
      payload_format: "json" as const,
      sending_stream: "transactional" as const,
      event_types: ["delivery" as const, "bounce" as const],
      domain_id: 435,
    };

    const responseData = {
      data: {
        id: 1,
        url: "https://example.com/mailtrap/webhooks",
        active: true,
        webhook_type: "email_sending",
        payload_format: "json",
        sending_stream: "transactional",
        domain_id: 435,
        event_types: ["delivery", "bounce"],
        signing_secret: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      },
    };

    it("creates a webhook and returns the signing_secret.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/webhooks`;
      const expectedBody = { webhook: params };

      expect.assertions(3);

      mock.onPost(endpoint, expectedBody).reply(200, responseData);
      const result = await webhooksAPI.create(params);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(expectedBody);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await webhooksAPI.create(params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const webhookId = 1;
    const responseData = {
      data: {
        id: webhookId,
        url: "https://example.com/mailtrap/webhooks",
        active: true,
        webhook_type: "email_sending",
        payload_format: "json",
        sending_stream: "transactional",
        domain_id: 435,
        event_types: ["delivery", "bounce"],
      },
    };

    it("gets a webhook by id.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/webhooks/${webhookId}`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await webhooksAPI.get(webhookId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await webhooksAPI.get(webhookId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const webhookId = 1;
    const params = {
      active: false,
      event_types: [
        "delivery" as const,
        "bounce" as const,
        "unsubscribe" as const,
      ],
    };

    const responseData = {
      data: {
        id: webhookId,
        url: "https://example.com/mailtrap/webhooks",
        active: false,
        webhook_type: "email_sending",
        payload_format: "json",
        sending_stream: "transactional",
        domain_id: 435,
        event_types: ["delivery", "bounce", "unsubscribe"],
      },
    };

    it("updates a webhook.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/webhooks/${webhookId}`;
      const expectedBody = { webhook: params };

      expect.assertions(3);

      mock.onPatch(endpoint, expectedBody).reply(200, responseData);
      const result = await webhooksAPI.update(webhookId, params);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.patch[0].data)).toEqual(expectedBody);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await webhooksAPI.update(webhookId, params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
