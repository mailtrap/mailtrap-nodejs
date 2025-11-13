import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactExportsApi from "../../../../lib/api/resources/ContactExports";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/ContactExports: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactExportsAPI = new ContactExportsApi(axios, accountId);

  const createContactExportRequest = {
    filters: [
      { name: "list_id", operator: "equal" as const, value: [101, 102] },
      {
        name: "subscription_status",
        operator: "equal" as const,
        value: "subscribed",
      },
    ],
  };

  const createContactExportResponse: {
    id: number;
    status: "started" | "created" | "finished";
    created_at: string;
    updated_at: string;
    url: string | null;
  } = {
    id: 69,
    status: "created",
    created_at: "2025-11-01T06:29:00.848Z",
    updated_at: "2025-11-01T06:29:00.848Z",
    url: null,
  };

  const getContactExportResponse: {
    id: number;
    status: "started" | "created" | "finished";
    created_at: string;
    updated_at: string;
    url: string | null;
  } = {
    id: 69,
    status: "finished",
    created_at: "2025-11-01T06:29:00.848Z",
    updated_at: "2025-11-01T06:29:01.053Z",
    url: "https://mailsend-us-mailtrap-tmp-uploads.s3.amazonaws.com/data_exports/export.csv.gz",
  };

  describe("class ContactExportsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactExportsAPI).toHaveProperty("create");
        expect(contactExportsAPI).toHaveProperty("get");
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
    it("successfully creates a contact export.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports`;
      const expectedResponseData = createContactExportResponse;

      expect.assertions(2);

      mock
        .onPost(endpoint, createContactExportRequest)
        .reply(200, expectedResponseData);
      const result = await contactExportsAPI.create(createContactExportRequest);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when filters are invalid.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports`;
      const expectedErrorMessage = {
        errors: {
          filters: "invalid",
        },
      };

      expect.assertions(2);

      mock.onPost(endpoint).reply(422, expectedErrorMessage);

      try {
        await contactExportsAPI.create(createContactExportRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          // When errors object doesn't match recognized pattern, falls back to default Axios error message
          expect(error.message).toBe("Request failed with status code 422");
        }
      }
    });

    it("fails with error when accountId is invalid.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports`;
      const expectedErrorMessage = "Account not found";

      expect.assertions(2);

      mock.onPost(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactExportsAPI.create(createContactExportRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toContain(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    const exportId = 69;

    it("successfully gets a contact export by id.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports/${exportId}`;
      const expectedResponseData = getContactExportResponse;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactExportsAPI.get(exportId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when export not found.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports/${exportId}`;
      const expectedErrorMessage = "Export not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactExportsAPI.get(exportId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toContain(expectedErrorMessage);
        }
      }
    });

    it("fails with error when exportId is invalid.", async () => {
      const invalidExportId = 999;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports/${invalidExportId}`;
      const expectedErrorMessage = "Export not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactExportsAPI.get(invalidExportId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toContain(expectedErrorMessage);
        }
      }
    });
  });
});
