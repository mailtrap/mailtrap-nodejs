import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import Stats from "../../../../lib/api/resources/Stats";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Stats: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const statsAPI = new Stats(axios, accountId);
  const baseURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/stats`;

  const defaultParams = {
    start_date: "2026-01-01",
    end_date: "2026-01-31",
  };

  const sampleStatsResponse = {
    delivery_count: 150,
    delivery_rate: 0.95,
    bounce_count: 8,
    bounce_rate: 0.05,
    open_count: 120,
    open_rate: 0.8,
    click_count: 60,
    click_rate: 0.5,
    spam_count: 2,
    spam_rate: 0.013,
  };

  const sampleGroupedByDomainResponse = [
    {
      sending_domain_id: 1,
      stats: {
        delivery_count: 100,
        delivery_rate: 0.96,
        bounce_count: 4,
        bounce_rate: 0.04,
        open_count: 80,
        open_rate: 0.8,
        click_count: 40,
        click_rate: 0.5,
        spam_count: 1,
        spam_rate: 0.01,
      },
    },
    {
      sending_domain_id: 2,
      stats: {
        delivery_count: 50,
        delivery_rate: 0.93,
        bounce_count: 4,
        bounce_rate: 0.07,
        open_count: 40,
        open_rate: 0.8,
        click_count: 20,
        click_rate: 0.5,
        spam_count: 1,
        spam_rate: 0.02,
      },
    },
  ];

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

  describe("class Stats(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(statsAPI).toHaveProperty("get");
        expect(statsAPI).toHaveProperty("byDomain");
        expect(statsAPI).toHaveProperty("byCategory");
        expect(statsAPI).toHaveProperty("byEmailServiceProvider");
        expect(statsAPI).toHaveProperty("byDate");
      });
    });
  });

  afterEach(() => {
    mock.reset();
  });

  describe("get(): ", () => {
    it("successfully gets aggregated sending stats.", async () => {
      expect.assertions(2);

      mock.onGet(baseURL).reply(200, sampleStatsResponse);
      const result = await statsAPI.get(defaultParams);

      expect(mock.history.get[0].url).toEqual(baseURL);
      expect(result).toEqual(sampleStatsResponse);
    });

    it("correctly serializes array filters in the query string.", async () => {
      expect.assertions(4);

      mock.onGet(baseURL).reply(200, sampleStatsResponse);
      await statsAPI.get({
        ...defaultParams,
        sending_domain_ids: [1, 2],
        sending_streams: ["transactional"],
        categories: ["Welcome email"],
        email_service_providers: ["Gmail"],
      });

      const { url, params } = mock.history.get[0];
      // Reconstruct what axios actually puts on the wire
      const serializedUrl = decodeURIComponent(
        axios.getUri({ url: url!, params })
      );

      // Must be single-bracketed, NOT double-bracketed
      expect(serializedUrl).toMatch(/sending_domain_ids\[\]=1/);
      expect(serializedUrl).not.toMatch(/sending_domain_ids\[\]\[\]/);
      expect(serializedUrl).toMatch(/sending_streams\[\]=transactional/);
      expect(serializedUrl).toMatch(/categories\[\]=Welcome(\+|%20| )email/);
    });

    it("fails with error when accountId is invalid.", async () => {
      const expectedErrorMessage = "Account not found";
      const statusCode = 404;

      expect.assertions(3);

      mock.onGet(baseURL).reply(statusCode, { error: expectedErrorMessage });

      try {
        await statsAPI.get(defaultParams);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(statusCode);
        }
      }
    });

    it("fails with error when unauthorized.", async () => {
      const expectedErrorMessage = "Incorrect API token";
      const statusCode = 401;

      expect.assertions(3);

      mock.onGet(baseURL).reply(statusCode, { error: expectedErrorMessage });

      try {
        await statsAPI.get(defaultParams);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
          // @ts-expect-error ES5 types don't know about cause property
          expect(error.cause?.response?.status).toEqual(statusCode);
        }
      }
    });
  });

  describe("byDomain(): ", () => {
    it("successfully gets stats grouped by domain.", async () => {
      const endpoint = `${baseURL}/domains`;

      expect.assertions(3);

      mock.onGet(endpoint).reply(200, sampleGroupedByDomainResponse);
      const result = await statsAPI.byDomain(defaultParams);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        {
          name: "sending_domain_id",
          value: 1,
          stats: sampleGroupedByDomainResponse[0].stats,
        },
        {
          name: "sending_domain_id",
          value: 2,
          stats: sampleGroupedByDomainResponse[1].stats,
        },
      ]);
    });
  });

  describe("byCategory(): ", () => {
    it("successfully gets stats grouped by category.", async () => {
      const endpoint = `${baseURL}/categories`;
      const responseData = [
        {
          category: "Transactional",
          stats: {
            delivery_count: 100,
            delivery_rate: 0.97,
            bounce_count: 3,
            bounce_rate: 0.03,
            open_count: 85,
            open_rate: 0.85,
            click_count: 45,
            click_rate: 0.53,
            spam_count: 0,
            spam_rate: 0.0,
          },
        },
      ];

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await statsAPI.byCategory(defaultParams);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual([
        {
          name: "category",
          value: "Transactional",
          stats: responseData[0].stats,
        },
      ]);
    });
  });

  describe("byEmailServiceProvider(): ", () => {
    it("successfully gets stats grouped by email service provider.", async () => {
      const endpoint = `${baseURL}/email_service_providers`;
      const responseData = [
        {
          email_service_provider: "Gmail",
          stats: {
            delivery_count: 80,
            delivery_rate: 0.97,
            bounce_count: 2,
            bounce_rate: 0.03,
            open_count: 70,
            open_rate: 0.88,
            click_count: 35,
            click_rate: 0.5,
            spam_count: 1,
            spam_rate: 0.013,
          },
        },
      ];

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await statsAPI.byEmailServiceProvider(defaultParams);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual([
        {
          name: "email_service_provider",
          value: "Gmail",
          stats: responseData[0].stats,
        },
      ]);
    });
  });

  describe("byDate(): ", () => {
    it("successfully gets stats grouped by date.", async () => {
      const endpoint = `${baseURL}/date`;
      const responseData = [
        {
          date: "2026-01-01",
          stats: {
            delivery_count: 5,
            delivery_rate: 1.0,
            bounce_count: 0,
            bounce_rate: 0.0,
            open_count: 4,
            open_rate: 0.8,
            click_count: 2,
            click_rate: 0.5,
            spam_count: 0,
            spam_rate: 0.0,
          },
        },
      ];

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await statsAPI.byDate(defaultParams);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual([
        {
          name: "date",
          value: "2026-01-01",
          stats: responseData[0].stats,
        },
      ]);
    });
  });
});
