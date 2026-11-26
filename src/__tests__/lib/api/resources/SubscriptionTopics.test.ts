import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import SubscriptionTopicsApi from "../../../../lib/api/resources/SubscriptionTopics";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import {
  ListSubscriptionTopicsResponse,
  SubscriptionTopic,
} from "../../../../types/api/subscription-topics";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/SubscriptionTopics: ", () => {
  let mock: AxiosMockAdapter;
  const subscriptionTopicsAPI = new SubscriptionTopicsApi(axios);
  const endpoint = `${GENERAL_ENDPOINT}/api/subscription_topics`;

  const allDomainsTopic: SubscriptionTopic = {
    id: 12,
    name: "Product updates",
    description: "News about features we ship",
    domain_id: null,
    deleted_at: null,
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  };

  const oneDomainTopic: SubscriptionTopic = {
    id: 13,
    name: "Weekly digest",
    description: null,
    domain_id: 4321,
    deleted_at: null,
    created_at: "2026-10-02T10:00:00.000Z",
    updated_at: "2026-10-02T10:00:00.000Z",
  };

  const listResponse: ListSubscriptionTopicsResponse = {
    data: [allDomainsTopic, oneDomainTopic],
    pagination: {
      token: 1,
      prev_token: null,
      next_token: 2,
      first_url: `${endpoint}?per_page=2&token=1`,
      prev_url: null,
      current_url: `${endpoint}?per_page=2&token=1`,
      next_url: `${endpoint}?per_page=2&token=2`,
    },
  };

  describe("class SubscriptionTopicsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(subscriptionTopicsAPI).toHaveProperty("getList");
        expect(subscriptionTopicsAPI).toHaveProperty("get");
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
    it("gets a page of topics wrapped in a data/pagination envelope.", async () => {
      expect.assertions(3);

      mock.onGet(endpoint).reply(200, listResponse);
      const result = await subscriptionTopicsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({});
      expect(result).toEqual(listResponse);
    });

    it("serializes per_page and token as query params.", async () => {
      const params = { per_page: 2, token: 2 };

      expect.assertions(2);

      mock.onGet(endpoint, { params }).reply(200, listResponse);
      const result = await subscriptionTopicsAPI.getList(params);

      expect(mock.history.get[0].params).toEqual(params);
      expect(result).toEqual(listResponse);
    });

    it("omits a null token, so pagination.next_token can be passed as is.", async () => {
      expect.assertions(1);

      mock.onGet(endpoint).reply(200, listResponse);
      await subscriptionTopicsAPI.getList({ per_page: 2, token: null });

      expect(mock.history.get[0].params).toEqual({ per_page: 2 });
    });

    it("fails with a MailtrapError on the empty 403 of an account without subscription topics.", async () => {
      expect.assertions(3);

      mock.onGet(endpoint).reply(403, "");

      try {
        await subscriptionTopicsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual("Request failed with status code 403");
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(403);
        }
      }
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Incorrect API token";

      expect.assertions(2);

      mock.onGet(endpoint).reply(401, { error: expectedErrorMessage });

      try {
        await subscriptionTopicsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const getEndpoint = `${endpoint}/${oneDomainTopic.id}`;

    it("gets a topic by id wrapped in a data envelope.", async () => {
      const responseData = { data: oneDomainTopic };

      expect.assertions(2);

      mock.onGet(getEndpoint).reply(200, responseData);
      const result = await subscriptionTopicsAPI.get(oneDomainTopic.id);

      expect(mock.history.get[0].url).toEqual(getEndpoint);
      expect(result).toEqual(responseData);
    });

    it("gets a deleted topic with its deleted_at.", async () => {
      const deletedAt = "2026-11-01T10:00:00.000Z";
      const responseData = {
        data: { ...oneDomainTopic, deleted_at: deletedAt },
      };

      expect.assertions(1);

      mock.onGet(getEndpoint).reply(200, responseData);
      const result = await subscriptionTopicsAPI.get(oneDomainTopic.id);

      expect(result.data.deleted_at).toEqual(deletedAt);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Not Found";

      expect.assertions(2);

      mock.onGet(getEndpoint).reply(404, { error: expectedErrorMessage });

      try {
        await subscriptionTopicsAPI.get(oneDomainTopic.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
