import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ApiTokensApi from "../../../../lib/api/resources/ApiTokens";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/ApiTokens: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const apiTokensAPI = new ApiTokensApi(axios, accountId);

  describe("class ApiTokensApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(apiTokensAPI).toHaveProperty("create");
        expect(apiTokensAPI).toHaveProperty("get");
        expect(apiTokensAPI).toHaveProperty("reset");
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
    const params = {
      name: "My API Token",
      resources: [
        {
          resource_type: "account" as const,
          resource_id: 3229,
          access_level: 100 as const,
        },
      ],
    };

    const responseData = {
      id: 12345,
      name: "My API Token",
      last_4_digits: "x7k9",
      created_by: "user@example.com",
      expires_at: null,
      resources: [
        {
          resource_type: "account",
          resource_id: 3229,
          access_level: 100,
        },
      ],
      token: "a1b2c3d4e5f6",
    };

    it("creates an API token and returns the full token value.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/api_tokens`;

      expect.assertions(3);

      mock.onPost(endpoint, params).reply(200, responseData);
      const result = await apiTokensAPI.create(params);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await apiTokensAPI.create(params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const tokenId = 12345;
    const responseData = {
      id: tokenId,
      name: "My API Token",
      last_4_digits: "x7k9",
      created_by: "user@example.com",
      expires_at: null,
      resources: [
        {
          resource_type: "account",
          resource_id: 3229,
          access_level: 100,
        },
      ],
    };

    it("gets an API token by id.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/api_tokens/${tokenId}`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await apiTokensAPI.get(tokenId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await apiTokensAPI.get(tokenId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("reset(): ", () => {
    const tokenId = 12345;
    const responseData = {
      id: tokenId,
      name: "My API Token",
      last_4_digits: "p3q4",
      created_by: "user@example.com",
      expires_at: null,
      resources: [
        {
          resource_type: "account",
          resource_id: 3229,
          access_level: 100,
        },
      ],
      token: "newtokenvalue",
    };

    it("resets an API token and returns the new token value.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/api_tokens/${tokenId}/reset`;

      expect.assertions(2);

      mock.onPost(endpoint).reply(200, responseData);
      const result = await apiTokensAPI.reset(tokenId);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await apiTokensAPI.reset(tokenId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
