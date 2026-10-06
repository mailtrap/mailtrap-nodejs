import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import PaginatedTemplatesApi from "../../../../lib/api/resources/PaginatedTemplates";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import {
  CreateTemplateParams,
  ListTemplatesResponse,
  Template,
  UpdateTemplateParams,
} from "../../../../types/api/paginated-templates";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/PaginatedTemplates: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const templatesAPI = new PaginatedTemplatesApi(axios, accountId);

  const createTemplateRequest: CreateTemplateParams = {
    name: "Welcome Email",
    subject: "Welcome to Our Service!",
    category: "Promotional",
    body_html: "<h1>Welcome!</h1><p>Thank you for joining our service.</p>",
    body_text: "Welcome! Thank you for joining our service.",
  };

  const createTemplateResponse: Template = {
    id: 1,
    uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
    name: "Welcome Email",
    subject: "Welcome to Our Service!",
    category: "Promotional",
    body_html: "<h1>Welcome!</h1><p>Thank you for joining our service.</p>",
    body_text: "Welcome! Thank you for joining our service.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  };

  const updateTemplateRequest: UpdateTemplateParams = {
    name: "Updated Welcome Email",
    subject: "Welcome to Our Amazing Service!",
    body_html:
      "<h1>Welcome!</h1><p>Thank you for joining our amazing service.</p>",
  };

  const updateTemplateResponse: Template = {
    id: 1,
    uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
    name: "Updated Welcome Email",
    subject: "Welcome to Our Amazing Service!",
    category: "Promotional",
    body_html:
      "<h1>Welcome!</h1><p>Thank you for joining our amazing service.</p>",
    body_text: "Welcome! Thank you for joining our service.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  };

  describe("class PaginatedTemplatesApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(templatesAPI).toHaveProperty("create");
        expect(templatesAPI).toHaveProperty("update");
        expect(templatesAPI).toHaveProperty("delete");
        expect(templatesAPI).toHaveProperty("get");
        expect(templatesAPI).toHaveProperty("getList");
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

  describe("getList(): ", () => {
    const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates`;
    const expectedResponseData: ListTemplatesResponse = {
      data: [
        {
          id: 1,
          uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
          name: "Welcome Email",
          subject: "Welcome to Our Service!",
          category: "Promotional",
          body_html:
            "<h1>Welcome!</h1><p>Thank you for joining our service.</p>",
          body_text: "Welcome! Thank you for joining our service.",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: 2,
          uuid: "923e39db-c74a-4830-b037-0e6ba8b1fe89",
          name: "Password Reset",
          subject: "Reset Your Password",
          category: "Transactional",
          body_html:
            "<h1>Password Reset</h1><p>Click here to reset your password.</p>",
          body_text: "Password Reset. Click here to reset your password.",
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ],
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

    it("successfully gets a page of templates.", async () => {
      expect.assertions(3);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await templatesAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({});
      expect(result).toEqual(expectedResponseData);
    });

    it("serializes per_page and token as query params.", async () => {
      const params = { per_page: 25, token: 2 };

      expect.assertions(2);

      mock.onGet(endpoint, { params }).reply(200, expectedResponseData);
      const result = await templatesAPI.getList(params);

      expect(mock.history.get[0].params).toEqual(params);
      expect(result).toEqual(expectedResponseData);
    });

    it("omits a null token, so pagination.next_token can be passed as is.", async () => {
      expect.assertions(1);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      await templatesAPI.getList({ per_page: 25, token: null });

      expect(mock.history.get[0].params).toEqual({ per_page: 25 });
    });

    it("returns null bodies as null.", async () => {
      const textOnly = {
        data: { ...createTemplateResponse, body_html: null },
      };

      expect.assertions(1);

      mock.onGet(`${endpoint}/1`).reply(200, textOnly);
      const result = await templatesAPI.get(1);

      expect(result.data.body_html).toBeNull();
    });

    it("fails with error.", async () => {
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onGet(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await templatesAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    it("successfully gets a template by ID.", async () => {
      const templateId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates/${templateId}`;
      const expectedResponseData = { data: createTemplateResponse };

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await templatesAPI.get(templateId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when getting a template.", async () => {
      const templateId = 999;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates/${templateId}`;
      const expectedErrorMessage = "Template not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await templatesAPI.get(templateId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    it("successfully creates a template with a flat request body.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates`;
      const expectedResponseData = { data: createTemplateResponse };

      expect.assertions(3);

      mock
        .onPost(endpoint, createTemplateRequest)
        .reply(201, expectedResponseData);
      const result = await templatesAPI.create(createTemplateRequest);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.post[0].data)).toEqual(
        createTemplateRequest
      );
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates`;
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onPost(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await templatesAPI.create(createTemplateRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const templateId = 1;

    it("successfully updates a template with a flat request body.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates/${templateId}`;
      const expectedResponseData = { data: updateTemplateResponse };

      expect.assertions(3);

      mock
        .onPatch(endpoint, updateTemplateRequest)
        .reply(200, expectedResponseData);
      const result = await templatesAPI.update(
        templateId,
        updateTemplateRequest
      );

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(JSON.parse(mock.history.patch[0].data)).toEqual(
        updateTemplateRequest
      );
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates/${templateId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onPatch(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await templatesAPI.update(templateId, updateTemplateRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const templateId = 1;

    it("successfully deletes a template.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates/${templateId}`;

      expect.assertions(1);

      mock.onDelete(endpoint).reply(204);
      await templatesAPI.delete(templateId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/templates/${templateId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await templatesAPI.delete(templateId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
