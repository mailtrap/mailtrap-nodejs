import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import SubAccountsApi from "../../../../lib/api/resources/SubAccounts";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/SubAccounts: ", () => {
  let mock: AxiosMockAdapter;
  const organizationId = 1001;
  const subAccountsAPI = new SubAccountsApi(axios, organizationId);

  describe("class SubAccountsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(subAccountsAPI).toHaveProperty("getList");
        expect(subAccountsAPI).toHaveProperty("create");
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
    const responseData = [
      { id: 12345, name: "Development Team Account" },
      { id: 12346, name: "QA Team Account" },
    ];

    it("gets the list of sub accounts.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/organizations/${organizationId}/sub_accounts`;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await subAccountsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await subAccountsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    const params = { name: "New Team Account" };
    const responseData = { id: 12347, name: "New Team Account" };

    it("creates a sub account.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/organizations/${organizationId}/sub_accounts`;
      const expectedBody = { account: params };

      expect.assertions(3);

      mock.onPost(endpoint, expectedBody).reply(200, responseData);
      const result = await subAccountsAPI.create(params);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(expectedBody);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      try {
        await subAccountsAPI.create(params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
