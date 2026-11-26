import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import ContactsApi from "../../../../lib/api/resources/Contacts";
import handleSendingError from "../../../../lib/axios-logger";
import MailtrapError from "../../../../lib/MailtrapError";
import { ContactSubscriptionTopic } from "../../../../types/api/contacts";

import CONFIG from "../../../../config";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

describe("lib/api/resources/Contacts: ", () => {
  let mock: AxiosMockAdapter;
  const accountId = 100;
  const contactsAPI = new ContactsApi(axios, accountId);

  const createContactRequest = {
    contact: {
      email: "john.smith@example.com",
      fields: {
        first_name: "John",
        last_name: "Smith",
      },
      list_ids: [1, 2, 3],
    },
  };

  const createContactResponse = {
    data: {
      id: "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132",
      status: "subscribed",
      email: "john.smith@example.com",
      fields: {
        first_name: "John",
        last_name: "Smith",
      },
      list_ids: [1, 2, 3],
      created_at: 1742820600230,
      updated_at: 1742820600230,
    },
  };

  const updateContactRequest = {
    contact: {
      email: "customer1@example.com",
      fields: {
        first_name: "John",
        last_name: "Smith",
        zip_code: "11111",
      },
      list_ids_included: [1, 2, 3],
      list_ids_excluded: [4, 5, 6],
      unsubscribed: false,
    },
  };

  const updateContactResponse = {
    data: {
      id: "01972696-84ef-783b-8a87-48067db2d16b",
      email: "john.smith111@example.com",
      created_at: 1748699088076,
      updated_at: 1748700400794,
      list_ids: [],
      status: "subscribed",
      fields: {
        first_name: "Johnny",
        last_name: "Smith",
      },
    },
  };

  const subscriptionTopics: ContactSubscriptionTopic[] = [
    { subscription_topic_id: 12, domain_id: 4321, status: "subscribed" },
    { subscription_topic_id: 12, domain_id: 4322, status: "unsubscribed" },
  ];

  const topicWriteFailedMessage =
    "The contact was saved, but its subscription topic preferences were not. " +
    "Send them again in an update of contact 018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132.";

  describe("class ContactsApi(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(contactsAPI).toHaveProperty("create");
        expect(contactsAPI).toHaveProperty("update");
        expect(contactsAPI).toHaveProperty("delete");
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
    it("successfully gets a contact by email.", async () => {
      const email = "john.smith@example.com";
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${email}`;
      const expectedResponseData = {
        data: {
          id: "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132",
          email: "john.smith@example.com",
          created_at: 1748699088076,
          updated_at: 1748699088076,
          list_ids: [1, 2, 3],
          status: "subscribed",
          fields: {
            first_name: "John",
            last_name: "Smith",
            zip_code: "11111",
          },
        },
      };

      expect.assertions(2);

      mock.onGet(endpoint).reply(200, expectedResponseData);
      const result = await contactsAPI.get(email);

      expect(mock.history.get[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it.each([
      ["a list of topic statuses", subscriptionTopics],
      ["null when they couldn't be read", null],
    ])("returns subscription_topics as %s.", async (_description, topics) => {
      const email = "john.smith@example.com";
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${email}`;
      const responseData = {
        data: { ...createContactResponse.data, subscription_topics: topics },
      };

      expect.assertions(1);

      mock.onGet(endpoint).reply(200, responseData);
      const result = await contactsAPI.get(email);

      expect(result.data.subscription_topics).toEqual(topics);
    });

    it("fails with error when getting a contact.", async () => {
      const email = "nonexistent@example.com";
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${email}`;
      const expectedErrorMessage = "Contact not found";

      expect.assertions(2);

      mock.onGet(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactsAPI.get(email);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("create(): ", () => {
    it("successfully creates a contact.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
      const expectedResponseData = createContactResponse;

      expect.assertions(2);

      mock
        .onPost(endpoint, createContactRequest)
        .reply(200, expectedResponseData);
      const result = await contactsAPI.create(createContactRequest.contact);

      expect(mock.history.post[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("sends subscription_topics and reads them back.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
      const contact = {
        ...createContactRequest.contact,
        subscription_topics: subscriptionTopics,
      };
      const responseData = {
        data: {
          ...createContactResponse.data,
          subscription_topics: subscriptionTopics,
        },
      };

      expect.assertions(2);

      mock.onPost(endpoint, { contact }).reply(201, responseData);
      const result = await contactsAPI.create(contact);

      expect(JSON.parse(mock.history.post[0].data)).toEqual({ contact });
      expect(result).toEqual(responseData);
    });

    it.each([
      [
        422,
        {
          errors: {
            subscription_topics: ["are not available for this account"],
          },
        },
        "subscription_topics: are not available for this account",
      ],
      [503, { errors: topicWriteFailedMessage }, topicWriteFailedMessage],
    ])(
      "fails with the topic error on %i.",
      async (statusCode, body, expectedErrorMessage) => {
        const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;

        expect.assertions(3);

        mock.onPost(endpoint).reply(statusCode, body);

        try {
          await contactsAPI.create({
            ...createContactRequest.contact,
            subscription_topics: subscriptionTopics,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(MailtrapError);
          if (error instanceof MailtrapError) {
            expect(error.message).toEqual(expectedErrorMessage);
            // @ts-expect-error ES5 types don't know about cause property
            expect(error.cause?.response?.status).toEqual(statusCode);
          }
        }
      }
    );

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
      const expectedErrorMessage = "Request failed with status code 400";

      expect.assertions(2);

      mock.onPost(endpoint).reply(400, { error: expectedErrorMessage });

      try {
        await contactsAPI.create(createContactRequest.contact);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("update(): ", () => {
    const contactId = "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132";

    it("successfully updates a contact.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedResponseData = updateContactResponse;

      expect.assertions(2);

      mock
        .onPatch(endpoint, updateContactRequest)
        .reply(200, expectedResponseData);
      const result = await contactsAPI.update(
        contactId,
        updateContactRequest.contact
      );

      expect(mock.history.patch[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("updates only the subscription topics.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const contact = {
        email: "john.smith111@example.com",
        subscription_topics: [subscriptionTopics[1]],
      };
      const responseData = {
        data: {
          ...updateContactResponse.data,
          subscription_topics: subscriptionTopics,
        },
      };

      expect.assertions(2);

      mock.onPatch(endpoint, { contact }).reply(200, responseData);
      const result = await contactsAPI.update(contactId, contact);

      expect(JSON.parse(mock.history.patch[0].data)).toEqual({ contact });
      expect(result.data.subscription_topics).toEqual(subscriptionTopics);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onPatch(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactsAPI.update(contactId, updateContactRequest.contact);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });

  describe("delete(): ", () => {
    const contactId = "018dd5e3-f6d2-7c00-8f9b-e5c3f2d8a132";

    it("successfully deletes a contact.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedResponseData = {
        data: {
          id: contactId,
          status: "unsubscribed",
          email: "john.smith@example.com",
          fields: {
            first_name: "John",
            last_name: "Smith",
          },
          list_ids: [],
          created_at: 1740659901189,
          updated_at: 1742903266889,
        },
      };

      expect.assertions(2);

      mock.onDelete(endpoint).reply(200, expectedResponseData);
      const result = await contactsAPI.delete(contactId);

      expect(mock.history.delete[0].url).toEqual(endpoint);
      expect(result).toEqual(expectedResponseData);
    });

    it("fails with error.", async () => {
      const endpoint = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/${contactId}`;
      const expectedErrorMessage = "Request failed with status code 404";

      expect.assertions(2);

      mock.onDelete(endpoint).reply(404, { error: expectedErrorMessage });

      try {
        await contactsAPI.delete(contactId);
      } catch (error) {
        expect(error).toBeInstanceOf(MailtrapError);
        if (error instanceof MailtrapError) {
          expect(error.message).toEqual(expectedErrorMessage);
        }
      }
    });
  });
});
