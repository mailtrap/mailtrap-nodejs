import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import ForwardRulesApi from "../../../../../lib/api/resources/inbound/ForwardRules";
import handleSendingError from "../../../../../lib/axios-logger";
import MailtrapError from "../../../../../lib/MailtrapError";
import {
  CreateForwardRuleParams,
  ForwardRule,
  ForwardRuleResponse,
  ForwardRulesListResponse,
  UpdateForwardRuleParams,
} from "../../../../../types/api/inbound/forward-rules";

describe("lib/api/resources/inbound/ForwardRules: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);
  axiosInstance.interceptors.response.use(
    (response) => response.data,
    handleSendingError
  );

  const forwardRulesAPI = new ForwardRulesApi(axiosInstance);
  const forwardRulesURL =
    "https://mailtrap.io/api/inbound/inboxes/42/forward_rules";

  const rule: ForwardRule = {
    id: 7,
    name: "Copy billing mail to finance",
    created_at: "2026-05-08T10:30:00.000Z",
    updated_at: "2026-05-08T10:30:00.000Z",
    conditions: [
      {
        match_type: "sender",
        operator: "ends_with",
        value: "@billing.example.com",
        header_key: null,
      },
    ],
    destinations: [{ email: "finance@example.com" }],
  };
  const ruleResponse: ForwardRuleResponse = { data: rule };

  const expectMailtrapError = async (request: () => Promise<unknown>) => {
    expect.assertions(2);

    try {
      await request();
    } catch (error) {
      expect(error).toBeInstanceOf(MailtrapError);

      if (error instanceof MailtrapError) {
        expect(error.message).toEqual("Not Found");
      }
    }
  };

  afterEach(() => mock.reset());

  describe("getList(): ", () => {
    it("lists forward rules in an inbox.", async () => {
      const listResponse: ForwardRulesListResponse = {
        data: [
          rule,
          {
            id: 8,
            name: "Forward everything to archive",
            created_at: "2026-05-08T11:00:00.000Z",
            updated_at: "2026-05-08T11:00:00.000Z",
            conditions: [],
            destinations: [{ email: "archive@example.com" }],
          },
        ],
      };

      mock.onGet(forwardRulesURL).reply(200, listResponse);

      const result = await forwardRulesAPI.getList(42);

      expect(result).toEqual(listResponse);
    });

    it("fails with error.", async () => {
      mock.onGet(forwardRulesURL).reply(404, { error: "Not Found" });

      await expectMailtrapError(() => forwardRulesAPI.getList(42));
    });
  });

  describe("get(): ", () => {
    it("returns a single forward rule.", async () => {
      const headerRule: ForwardRuleResponse = {
        data: {
          ...rule,
          id: 9,
          conditions: [
            {
              match_type: "header",
              operator: "equal",
              value: "high",
              header_key: "X-Priority-Level",
            },
          ],
        },
      };

      mock.onGet(`${forwardRulesURL}/9`).reply(200, headerRule);

      const result = await forwardRulesAPI.get(42, 9);

      expect(result).toEqual(headerRule);
    });

    it("fails with error.", async () => {
      mock.onGet(`${forwardRulesURL}/9`).reply(404, { error: "Not Found" });

      await expectMailtrapError(() => forwardRulesAPI.get(42, 9));
    });
  });

  describe("create(): ", () => {
    const params: CreateForwardRuleParams = {
      name: "Copy billing mail to finance",
      conditions: [
        {
          match_type: "sender",
          operator: "ends_with",
          value: "@billing.example.com",
        },
      ],
      destinations: [{ email: "finance@example.com" }],
    };

    it("creates a forward rule with an unwrapped body.", async () => {
      mock.onPost(forwardRulesURL).reply(201, ruleResponse);

      const result = await forwardRulesAPI.create(42, params);

      expect(JSON.parse(mock.history.post[0].data)).toEqual(params);
      expect(result).toEqual(ruleResponse);
    });

    it("fails with error.", async () => {
      mock.onPost(forwardRulesURL).reply(404, { error: "Not Found" });

      await expectMailtrapError(() => forwardRulesAPI.create(42, params));
    });
  });

  describe("update(): ", () => {
    it("sends only the fields provided.", async () => {
      const params: UpdateForwardRuleParams = {
        destinations: [
          { email: "finance@example.com" },
          { email: "accounting@example.com" },
        ],
      };

      mock.onPatch(`${forwardRulesURL}/7`).reply(200, ruleResponse);

      const result = await forwardRulesAPI.update(42, 7, params);

      expect(JSON.parse(mock.history.patch[0].data)).toEqual(params);
      expect(result).toEqual(ruleResponse);
    });

    it("sends an empty array to clear conditions.", async () => {
      const params: UpdateForwardRuleParams = { conditions: [] };

      mock.onPatch(`${forwardRulesURL}/7`).reply(200, {
        data: { ...rule, conditions: [] },
      });

      await forwardRulesAPI.update(42, 7, params);

      expect(JSON.parse(mock.history.patch[0].data)).toEqual({
        conditions: [],
      });
    });

    it("fails with error.", async () => {
      mock.onPatch(`${forwardRulesURL}/7`).reply(404, { error: "Not Found" });

      await expectMailtrapError(() =>
        forwardRulesAPI.update(42, 7, { name: "Renamed" })
      );
    });
  });

  describe("delete(): ", () => {
    it("deletes a forward rule.", async () => {
      mock.onDelete(`${forwardRulesURL}/7`).reply(204);

      const result = await forwardRulesAPI.delete(42, 7);

      expect(result).toBeUndefined();
    });

    it("fails with error.", async () => {
      mock.onDelete(`${forwardRulesURL}/7`).reply(404, { error: "Not Found" });

      await expectMailtrapError(() => forwardRulesAPI.delete(42, 7));
    });
  });
});
