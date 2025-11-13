import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactImportsApi from "../../../../lib/api/resources/ContactImports";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import {
  ContactImportResponse,
  ImportContactsRequest,
} from "../../../../types/api/contact-imports";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/ContactImports: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactImportsAPI = new ContactImportsApi(axios, accountId);

  const createImportRequest: ImportContactsRequest = {
    contacts: [
      {
        email: "customer1@example.com",
        fields: {
          first_name: "John",
          last_name: "Doe",
        },
        list_ids_included: [1, 2],
      },
      {
        email: "customer2@example.com",
        fields: {
          first_name: "Jane",
          zip_code: 12345,
        },
        list_ids_excluded: [3],
      },
    ],
  };

  const createImportResponse: ContactImportResponse = {
    id: 1,
    status: "created",
    created_contacts_count: 2,
    updated_contacts_count: 0,
    contacts_over_limit_count: 0,
  };

  const getImportResponse: ContactImportResponse = {
    id: 1,
    status: "finished",
    created_contacts_count: 2,
    updated_contacts_count: 0,
    contacts_over_limit_count: 0,
  };

  describe("class ContactImportsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactImportsAPI).toHaveProperty("create");
        expect(contactImportsAPI).toHaveProperty("get");
      });
    });
  });

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

  describe("create(): ", () => {
    it("successfully creates a contact import.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports`;
      const expectedResponseData = createImportResponse;

      expect.assertions(2);

      mock
        .onPost(endpoint, createImportRequest)
        .reply(200, expectedResponseData);
      const result = await contactImportsAPI.create(createImportRequest);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully creates a contact import with minimal data.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports`;
      const minimalRequest: ImportContactsRequest = {
        contacts: [
          {
            email: "customer@example.com",
          },
        ],
      };
      const expectedResponseData: ContactImportResponse = {
        id: 2,
        status: "created",
      };

      expect.assertions(2);

      mock.onPost(endpoint, minimalRequest).reply(200, expectedResponseData);
      const result = await contactImportsAPI.create(minimalRequest);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports`;
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onPost(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await contactImportsAPI.create(createImportRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with validation error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports`;
      const invalidRequest: ImportContactsRequest = {
        contacts: [
          {
            email: "invalid-email",
          },
        ],
      };
      const expectedErrorMessage = "Invalid email format";

      expect.assertions(2);

      mock.onPost(endpoint).reply(422, { error: expectedErrorMessage });

      try {
        await contactImportsAPI.create(invalidRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });

    it("fails with array of validation errors.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports`;
      const invalidRequest: ImportContactsRequest = {
        contacts: [
          {
            email: "invalid-email-1",
          },
          {
            email: "invalid-email-2",
          },
        ],
      };

      expect.assertions(2);

      // API returns errors as an array of objects (confirmed by actual API response)
      // Each object contains the email and nested errors object with field-specific messages
      mock.onPost(endpoint).reply(422, {
        errors: [
          {
            email: "invalid-email-1",
            errors: {
              email: ["is invalid", "is required"],
            },
          },
          {
            email: "invalid-email-2",
            errors: {
              base: ["Contact limit exceeded"],
            },
          },
        ],
      });

      try {
        await contactImportsAPI.create(invalidRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toBe(
            "invalid-email-1: email: is invalid, is required | invalid-email-2: Contact limit exceeded"
          );
        }
      }
    });
  });

  describe("get(): ", () => {
    it("successfully gets a contact import by ID.", async () => {
      const importId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports/${importId}`;
      const expectedResponseData = getImportResponse;

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactImportsAPI.get(importId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets a contact import with all status fields.", async () => {
      const importId = 2;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports/${importId}`;
      const expectedResponseData: ContactImportResponse = {
        id: importId,
        status: "failed",
        created_contacts_count: 5,
        updated_contacts_count: 3,
        contacts_over_limit_count: 2,
      };

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactImportsAPI.get(importId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when getting a contact import.", async () => {
      const importId = 999;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports/${importId}`;
      const expectedErrorMessage = "Contact import not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactImportsAPI.get(importId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
