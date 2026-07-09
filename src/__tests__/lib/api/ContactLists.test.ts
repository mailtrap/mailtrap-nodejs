import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactLists from "../../../lib/api/ContactLists";
import handleSendingError from "../../../lib/axios-logger";
import { ContactList } from "../../../types/api/contactlist";

import CONFIG from "../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/ContactLists: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactListsAPI = new ContactLists(axios, accountId);

  describe("class ContactLists(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactListsAPI).toHaveProperty("create");
        expect(contactListsAPI).toHaveProperty("getList");
        expect(contactListsAPI).toHaveProperty("get");
        expect(contactListsAPI).toHaveProperty("update");
        expect(contactListsAPI).toHaveProperty("delete");
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

    it("passes the search param to the request.", async () => {
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
  });
});
