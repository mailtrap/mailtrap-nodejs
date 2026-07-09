import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactListsApi from "../../../../lib/api/resources/ContactLists";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import { ContactList } from "../../../../types/api/contactlist";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/ContactLists: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactListsAPI = new ContactListsApi(axios, accountId);

  const createListRequest = {
    name: "Test List",
  };

  const createListResponse: ContactList = {
    id: 1,
    name: "Test List",
  };

  const updateListRequest = {
    name: "Updated Test List",
  };

  const updateListResponse: ContactList = {
    id: 1,
    name: "Updated Test List",
  };

  describe("class ContactListsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactListsAPI).toHaveProperty("create");
        expect(contactListsAPI).toHaveProperty("update");
        expect(contactListsAPI).toHaveProperty("delete");
        expect(contactListsAPI).toHaveProperty("get");
        expect(contactListsAPI).toHaveProperty("getList");
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

  describe("getAll(): ", () => {
    it("successfully gets all contact lists.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedResponseData: ContactList[] = [
        { id: 1, name: "Test List 1" },
        { id: 2, name: "Test List 2" },
      ];

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactListsAPI.getList();

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("successfully gets contact lists filtered by name.", async () => {
      const search = "news";
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedResponseData: ContactList[] = [
        { id: 1, name: "Newsletter" },
      ];

      expect.assertions(3);

      mock
        .onGet(endpoint, { params: { search } })
        .reply(200, expectedResponseData);
      const result = await contactListsAPI.getList({ search });

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(mock.history.get[0].params).toEqual({ search });
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onGet(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await contactListsAPI.getList();
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("get(): ", () => {
    it("successfully gets a contact list by ID.", async () => {
      const listId = 1;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists/${listId}`;
      const expectedResponseData: ContactList = {
        id: listId,
        name: "Test List",
      };

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactListsAPI.get(listId);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error when getting a contact list.", async () => {
      const listId = 999;
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists/${listId}`;
      const expectedErrorMessage = "Contact list not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactListsAPI.get(listId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    it("successfully creates a contact list.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedResponseData = createListResponse;

      expect.assertions(2);

      mock.onPost(endpoint, createListRequest).reply(200, expectedResponseData);
      const result = await contactListsAPI.create(createListRequest);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onPost(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await contactListsAPI.create(createListRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const listId = 1;

    it("successfully updates a contact list.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists/${listId}`;
      const expectedResponseData = updateListResponse;

      expect.assertions(2);

      mock
        .onPatch(endpoint, updateListRequest)
        .reply(200, expectedResponseData);
      const result = await contactListsAPI.update(listId, updateListRequest);

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists/${listId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onPatch(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactListsAPI.update(listId, updateListRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const listId = 1;

    it("successfully deletes a contact list.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists/${listId}`;

      expect.assertions(1);

      mock.onDelete(endpoint).reply(204);
      await contactListsAPI.delete(listId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists/${listId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactListsAPI.delete(listId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
