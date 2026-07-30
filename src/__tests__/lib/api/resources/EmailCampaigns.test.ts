import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import EmailCampaignsApi from "../../../../lib/api/resources/EmailCampaigns";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/EmailCampaigns: ", () => {
  let mock: AxiosMockAdapter;
  const emailCampaignsAPI = new EmailCampaignsApi(axios);
  const endpoint = `${GENERAL_ENDPOINT}/api/email_campaigns`;

  const campaign = {
    id: 4567,
    domain_id: 4321,
    domain_name: "acme.com",
    name: "Spring Sale",
    from_local_part: "news",
    from_display_name: "Acme Marketing",
    reply_to: {
      display_name: "Acme Support",
      local_part: "support",
      domain: "acme.com",
    },
    current_state: "draft",
    current_state_metadata: {},
    created_at: "2026-05-01T10:15:00.000Z",
    updated_at: "2026-05-02T09:00:00.000Z",
    last_started_at: null,
    recipient_total_count: null,
    contact_list_ids: [55, 56],
    contact_segment_ids: [12],
    delivery_mode: "rapid",
    delivery_options: { emails_per_hour: null },
    template: {
      id: 789,
      subject: "Spring is here — 30% off",
      merge_tags: ["first_name"],
      body_html:
        '<html><body><h1>Hi {{first_name}}!</h1><p><a href="__unsubscribe_url__">Unsubscribe</a></p></body></html>',
      body_text: null,
    },
  };

  describe("class EmailCampaignsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(emailCampaignsAPI).toHaveProperty("getList");
        expect(emailCampaignsAPI).toHaveProperty("create");
        expect(emailCampaignsAPI).toHaveProperty("get");
        expect(emailCampaignsAPI).toHaveProperty("update");
        expect(emailCampaignsAPI).toHaveProperty("delete");
        expect(emailCampaignsAPI).toHaveProperty("start");
        expect(emailCampaignsAPI).toHaveProperty("schedule");
        expect(emailCampaignsAPI).toHaveProperty("cancel");
        expect(emailCampaignsAPI).toHaveProperty("terminate");
        expect(emailCampaignsAPI).toHaveProperty("reset");
        expect(emailCampaignsAPI).toHaveProperty("getStats");
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
    // List items omit the template bodies.
    const listItem = {
      ...campaign,
      template: {
        id: 789,
        subject: "Spring is here — 30% off",
        merge_tags: ["first_name"],
      },
    };

    const responseData = {
      data: [listItem],
      pagination: {
        token: 1,
        prev_token: null,
        next_token: 2,
        first_url: `${endpoint}?per_page=50&token=1`,
        prev_url: null,
        current_url: `${endpoint}?per_page=50&token=1`,
        next_url: `${endpoint}?per_page=50&token=2`,
      },
    };

    it("gets the list of email campaigns wrapped in a data/pagination envelope.", async () => {
      expect.assertions(2);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(responseData);
    });

    it("serializes per_page, search and token as query params.", async () => {
      expect.assertions(2);

      const params = { per_page: 25, search: "spring", token: 2 };
      mock.onGet(endpoint, { params }).reply(200, responseData);
      await emailCampaignsAPI.getList(params);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual(params);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Account access forbidden";

      expect.assertions(2);

      mock.onGet(endpoint).reply(403, { errors: "Account access forbidden" });

      try {
        await emailCampaignsAPI.getList();
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
      name: "Spring Sale",
      domain_id: 4321,
      from_display_name: "Acme Marketing",
      from_local_part: "news",
      reply_to: {
        display_name: "Acme Support",
        local_part: "support",
        domain: "acme.com",
      },
      template_attributes: {
        subject: "Spring is here — 30% off",
        body_html:
          '<html><body><h1>Hi {{first_name}}!</h1><p><a href="__unsubscribe_url__">Unsubscribe</a></p></body></html>',
        merge_tags: ["first_name"],
      },
      delivery_mode: "gradual" as const,
      delivery_options: { emails_per_hour: 1000 },
      contact_list_ids: [55, 56],
      contact_segment_ids: [12],
    };

    const responseData = { data: campaign };

    it("creates an email campaign with a flat body and returns the data envelope.", async () => {
      expect.assertions(3);

      mock.onPost(endpoint, params).reply(201, responseData);
      const result = await emailCampaignsAPI.create(params);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "domain_id: must exist";

      expect.assertions(2);

      mock
        .onPost(endpoint)
        .reply(422, { errors: { domain_id: ["must exist"] } });

      try {
        await emailCampaignsAPI.create(params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const campaignId = 4567;
    const getEndpoint = `${endpoint}/${campaignId}`;

    it("gets a campaign by id wrapped in a data envelope.", async () => {
      const responseData = { data: campaign };

      expect.assertions(2);

      mock.onGet(getEndpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.get(campaignId);

      expect(mock.history.get[0].url).toEqual(getEndpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Not Found";

      expect.assertions(2);

      mock.onGet(getEndpoint).reply(404, { error: "Not Found" });

      try {
        await emailCampaignsAPI.get(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const campaignId = 4567;
    const updateEndpoint = `${endpoint}/${campaignId}`;
    const params = {
      name: "Spring Sale (updated)",
      delivery_mode: "gradual" as const,
      delivery_options: { emails_per_hour: 1000 },
      template_attributes: {
        subject: "New subject",
        body_text: "Hi {{first_name}}! Unsubscribe: __unsubscribe_url__",
      },
      contact_list_ids: [55],
    };

    const responseData = {
      data: {
        ...campaign,
        name: "Spring Sale (updated)",
        delivery_mode: "gradual",
        delivery_options: { emails_per_hour: 1000 },
        contact_list_ids: [55],
      },
    };

    it("updates a campaign with a flat PATCH body and returns the data envelope.", async () => {
      expect.assertions(3);

      mock.onPatch(updateEndpoint, params).reply(200, responseData);
      const result = await emailCampaignsAPI.update(campaignId, params);

      expect(mock.history.patch[0].url).toEqual(updateEndpoint);
      expect(JSON.parse(mock.history.patch[0].data)).toEqual(params);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "from_local_part: can't be blank";

      expect.assertions(2);

      mock
        .onPatch(updateEndpoint)
        .reply(422, { errors: { from_local_part: ["can't be blank"] } });

      try {
        await emailCampaignsAPI.update(campaignId, params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const campaignId = 4567;
    const deleteEndpoint = `${endpoint}/${campaignId}`;

    it("deletes a campaign, returning nothing (204 No Content).", async () => {
      expect.assertions(2);

      mock.onDelete(deleteEndpoint).reply(204);
      const result = await emailCampaignsAPI.delete(campaignId);

      expect(mock.history.delete[0].url).toEqual(deleteEndpoint);
      expect(result).toBeUndefined();
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "campaign is sending";

      expect.assertions(2);

      mock
        .onDelete(deleteEndpoint)
        .reply(422, { errors: { base: ["campaign is sending"] } });

      try {
        await emailCampaignsAPI.delete(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("start(): ", () => {
    const campaignId = 4567;
    const startEndpoint = `${endpoint}/${campaignId}/start`;

    it("starts a draft campaign and returns the data envelope.", async () => {
      const responseData = { data: { ...campaign, current_state: "started" } };

      expect.assertions(2);

      mock.onPost(startEndpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.start(campaignId);

      expect(mock.history.post[0].url).toEqual(startEndpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Campaign design can't be blank";

      expect.assertions(2);

      mock
        .onPost(startEndpoint)
        .reply(422, { errors: ["Campaign design can't be blank"] });

      try {
        await emailCampaignsAPI.start(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("schedule(): ", () => {
    const campaignId = 4567;
    const scheduleEndpoint = `${endpoint}/${campaignId}/schedule`;
    const params = { datetime: "2026-06-01T09:00:00.000Z" };

    it("schedules a draft campaign and returns the data envelope.", async () => {
      const responseData = {
        data: {
          ...campaign,
          current_state: "scheduled",
          current_state_metadata: {
            scheduled_at: "2026-06-01T09:00:00.000Z",
          },
        },
      };

      expect.assertions(3);

      mock.onPost(scheduleEndpoint, params).reply(200, responseData);
      const result = await emailCampaignsAPI.schedule(campaignId, params);

      expect(mock.history.post[0].url).toEqual(scheduleEndpoint);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage =
        "Cannot transition from 'started' to 'scheduled'";

      expect.assertions(2);

      mock.onPost(scheduleEndpoint).reply(422, {
        errors: "Cannot transition from 'started' to 'scheduled'",
      });

      try {
        await emailCampaignsAPI.schedule(campaignId, params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("cancel(): ", () => {
    const campaignId = 4567;
    const cancelEndpoint = `${endpoint}/${campaignId}/cancel`;

    it("cancels a scheduled campaign and returns the data envelope.", async () => {
      const responseData = { data: campaign };

      expect.assertions(2);

      mock.onPost(cancelEndpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.cancel(campaignId);

      expect(mock.history.post[0].url).toEqual(cancelEndpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Campaign is not scheduled";

      expect.assertions(2);

      mock
        .onPost(cancelEndpoint)
        .reply(422, { errors: "Campaign is not scheduled" });

      try {
        await emailCampaignsAPI.cancel(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("terminate(): ", () => {
    const campaignId = 4567;
    const terminateEndpoint = `${endpoint}/${campaignId}/terminate`;

    it("terminates a sending campaign and returns the data envelope.", async () => {
      const responseData = {
        data: { ...campaign, current_state: "terminating" },
      };

      expect.assertions(2);

      mock.onPost(terminateEndpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.terminate(campaignId);

      expect(mock.history.post[0].url).toEqual(terminateEndpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage =
        "Cannot transition from 'draft' to 'terminating'";

      expect.assertions(2);

      mock.onPost(terminateEndpoint).reply(422, {
        errors: "Cannot transition from 'draft' to 'terminating'",
      });

      try {
        await emailCampaignsAPI.terminate(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("reset(): ", () => {
    const campaignId = 4567;
    const resetEndpoint = `${endpoint}/${campaignId}/reset`;

    it("resets a scheduled campaign to draft and returns the data envelope.", async () => {
      const responseData = { data: campaign };

      expect.assertions(2);

      mock.onPost(resetEndpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.reset(campaignId);

      expect(mock.history.post[0].url).toEqual(resetEndpoint);
      expect(result).toEqual(responseData);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Campaign is not scheduled";

      expect.assertions(2);

      mock
        .onPost(resetEndpoint)
        .reply(422, { errors: "Campaign is not scheduled" });

      try {
        await emailCampaignsAPI.reset(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("getStats(): ", () => {
    const campaignId = 4567;
    const statsEndpoint = `${endpoint}/${campaignId}/stats`;

    const responseData = {
      data: {
        delivery_count: 1450,
        open_count: 820,
        click_count: 310,
        bounce_count: 30,
        unsubscription_count: 12,
        sent_count: 1500,
        spam_count: 5,
        delivery_rate: 0.9667,
        open_rate: 0.5655,
        click_rate: 0.2138,
        bounce_rate: 0.02,
        spam_rate: 0.0033,
        unsubscription_rate: 0.0083,
      },
    };

    it("gets campaign stats wrapped in a data envelope.", async () => {
      expect.assertions(2);

      mock.onGet(statsEndpoint).reply(200, responseData);
      const result = await emailCampaignsAPI.getStats(campaignId);

      expect(mock.history.get[0].url).toEqual(statsEndpoint);
      expect(result).toEqual(responseData);
    });

    it("serializes start_date and end_date as query params.", async () => {
      expect.assertions(2);

      const params = { start_date: "2026-05-01", end_date: "2026-05-31" };
      mock.onGet(statsEndpoint, { params }).reply(200, responseData);
      await emailCampaignsAPI.getStats(campaignId, params);

      expect(mock.history.get[0].url).toEqual(statsEndpoint);
      expect(mock.history.get[0].params).toEqual(params);
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Not Found";

      expect.assertions(2);

      mock.onGet(statsEndpoint).reply(404, { error: "Not Found" });

      try {
        await emailCampaignsAPI.getStats(campaignId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);

        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
