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
});
