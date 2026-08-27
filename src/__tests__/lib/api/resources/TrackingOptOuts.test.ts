import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import TrackingOptOutsApi from "../../../../lib/api/resources/TrackingOptOuts";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import { TrackingOptOut } from "../../../../types/api/tracking-opt-outs";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/TrackingOptOuts: ", () => {
  let mock: AxiosMockAdapter;
  const trackingOptOutsAPI = new TrackingOptOutsApi(axios);
  const endpoint = `${GENERAL_ENDPOINT}/api/tracking_opt_outs`;

  const mockTrackingOptOut: TrackingOptOut = {
    id: "64d71bf3-1276-417b-86e1-8e66f138acfe",
    email: "tracked@example.com",
    created_at: "2025-01-15T10:30:00Z",
    domain_name: "example.com",
  };

  beforeAll(() => {
    axios.interceptors.response.use(
      (response) => response.data,
      handleSendingError
    );
    mock = new AxiosMockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe("class TrackingOptOutsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(trackingOptOutsAPI).toHaveProperty("getList");
        expect(trackingOptOutsAPI).toHaveProperty("create");
        expect(trackingOptOutsAPI).toHaveProperty("delete");
      });
    });
  });

  describe("getList(): ", () => {
    it("returns the page and the cursor.", async () => {
      const expectedResponse = {
        data: [mockTrackingOptOut],
        last_id: mockTrackingOptOut.id,
      };

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponse);
      const result = await trackingOptOutsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponse);
    });

    it("returns a null cursor on the last page.", async () => {
      expect.assertions(1);

      mock.onGet(endpoint).reply(200, { data: [], last_id: null });
      const result = await trackingOptOutsAPI.getList();

      expect(result.last_id).toBeNull();
    });

    it("passes the filters as query params.", async () => {
      const params = {
        email: "tracked@example.com",
        start_time: "2025-01-01T00:00:00Z",
        end_time: "2025-12-31T23:59:59Z",
        last_id: mockTrackingOptOut.id,
      };

      expect.assertions(1);

      mock.onGet(endpoint).reply(200, { data: [], last_id: null });
      await trackingOptOutsAPI.getList(params);

      expect(mock.history.get[0].params).toEqual(params);
    });

    it("omits unset filters.", async () => {
      expect.assertions(1);

      mock.onGet(endpoint).reply(200, { data: [], last_id: null });
      await trackingOptOutsAPI.getList({ email: "tracked@example.com" });

      expect(mock.history.get[0].params).toEqual({
        email: "tracked@example.com",
      });
    });

    it("fails with unauthorized error (401).", async () => {
      const expectedErrorMessage = "Incorrect API token";

      expect.assertions(2);

      mock.onGet(endpoint).reply(401, { error: expectedErrorMessage });

      try {
        await trackingOptOutsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    const params = { email: "tracked@example.com", domain_id: 12345 };

    it("sends a flat body and returns the wrapped opt-out.", async () => {
      const expectedResponse = { data: mockTrackingOptOut };

      expect.assertions(2);

      mock.onPost(endpoint).reply(201, expectedResponse);
      const result = await trackingOptOutsAPI.create(params);

      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
      expect(result).toEqual(expectedResponse);
    });

    it("fails with forbidden error (403).", async () => {
      const expectedErrorMessage = "Access forbidden";

      expect.assertions(2);

      mock.onPost(endpoint).reply(403, { errors: expectedErrorMessage });

      try {
        await trackingOptOutsAPI.create(params);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const deleteEndpoint = `${endpoint}/${mockTrackingOptOut.id}`;

    it("returns the deleted opt-out from the unwrapped response.", async () => {
      expect.assertions(2);

      mock.onDelete(deleteEndpoint).reply(200, mockTrackingOptOut);
      const result = await trackingOptOutsAPI.delete(mockTrackingOptOut.id);

      expect(mock.history.delete[0].url).toEqual(deleteEndpoint);
      expect(result).toEqual(mockTrackingOptOut);
    });

    it("fails with not found error (404).", async () => {
      const expectedErrorMessage = "Tracking opt-out not found";

      expect.assertions(2);

      mock
        .onDelete(deleteEndpoint)
        .reply(404, { errors: expectedErrorMessage });

      try {
        await trackingOptOutsAPI.delete(mockTrackingOptOut.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
