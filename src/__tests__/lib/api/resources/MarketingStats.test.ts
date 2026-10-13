import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import MarketingStatsApi from "../../../../lib/api/resources/MarketingStats";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/MarketingStats: ", () => {
  let mock: AxiosMockAdapter;
  const marketingStatsAPI = new MarketingStatsApi(axios);
  const endpoint = `${GENERAL_ENDPOINT}/api/marketing/stats`;

  const defaultParams = {
    start_date: "2026-05-01",
    end_date: "2026-05-31",
  };

  const responseData = {
    data: {
      delivery_count: 1200,
      delivery_rate: 0.96,
      bounce_count: 50,
      bounce_rate: 0.04,
      open_count: 600,
      open_rate: 0.5,
      click_count: 240,
      click_rate: 0.2,
      spam_count: 3,
      spam_rate: 0.0025,
      unsubscription_count: 12,
      unsubscription_rate: 0.01,
      sent_count: 1250,
    },
  };

  describe("class MarketingStatsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(marketingStatsAPI).toHaveProperty("get");
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

  describe("get(): ", () => {
    it("gets marketing stats wrapped in a data envelope.", async () => {
      expect.assertions(3);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await marketingStatsAPI.get(defaultParams);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual(defaultParams);
      expect(result).toEqual(responseData);
    });

    it("serializes array filters as single-bracketed query params.", async () => {
      expect.assertions(1);

      mock.onGet(endpoint).reply(200, responseData);
      await marketingStatsAPI.get({
        ...defaultParams,
        sending_domain_ids: [3938, 3939],
        sources: ["campaigns"],
        email_service_providers: ["Google", "Google Workspace"],
      });

      const { url, params } = mock.history.get[0];
      // Reconstruct what axios actually puts on the wire
      const serializedUrl = decodeURIComponent(
        axios.getUri({ url: url!, params })
      );

      expect(serializedUrl).toBe(
        `${endpoint}?start_date=2026-05-01&end_date=2026-05-31` +
          "&sending_domain_ids[]=3938&sending_domain_ids[]=3939" +
          "&sources[]=campaigns" +
          "&email_service_providers[]=Google&email_service_providers[]=Google+Workspace"
      );
    });

    it.each([
      [400, { errors: "Invalid source: 'newsletters'" }],
      [401, { error: "Incorrect API token" }],
      [403, { errors: "Access forbidden" }],
    ])("fails with error on %i.", async (statusCode, body) => {
      expect.assertions(3);

      mock.onGet(endpoint).reply(statusCode, body);

      try {
        await marketingStatsAPI.get(defaultParams);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(Object.values(body)[0]);
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(statusCode);
        }
      }
    });
  });
});
