import axios from "axios";

import General from "../../../lib/api/General";

describe("lib/api/General: ", () => {
  const testAccountId = 100;

  describe("class General(): ", () => {
    describe("constructor with accountId: ", () => {
      const generalAPI = new General(axios, testAccountId);

      it("initializes with all necessary properties when accountId is provided.", () => {
        expect(generalAPI).toHaveProperty("accountAccesses");
        expect(generalAPI).toHaveProperty("accounts");
        expect(generalAPI).toHaveProperty("permissions");
        expect(generalAPI).toHaveProperty("billing");
        expect(generalAPI).toHaveProperty("apiTokens");
      });

      it("lazily instantiates account-specific APIs via getters when accountId is provided.", () => {
        expect(generalAPI.accountAccesses).toBeDefined();
        expect(generalAPI.permissions).toBeDefined();
        expect(generalAPI.billing).toBeDefined();
        expect(generalAPI.accounts).toBeDefined();
        expect(generalAPI.apiTokens).toBeDefined();
      });
    });

    describe("constructor without accountId: ", () => {
      const generalAPI = new General(axios);

      it("initializes with accounts property when accountId is not provided.", () => {
        expect(generalAPI).toHaveProperty("accounts");
        expect(generalAPI.accounts).toBeDefined();
      });

      it("allows access to accounts API for account discovery.", () => {
        expect(generalAPI.accounts).toBeDefined();
        expect(typeof generalAPI.accounts.getAllAccounts).toBe("function");
      });
    });

    describe("lazy instantiation: ", () => {
      const generalAPI = new General(axios);

      it("throws error when accessing accountAccesses without accountId.", () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.accountAccesses;
        }).toThrow(
          "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
        );
      });

      it("throws error when accessing permissions without accountId.", () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.permissions;
        }).toThrow(
          "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
        );
      });

      it("throws error when accessing billing without accountId.", () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.billing;
        }).toThrow(
          "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
        );
      });

      it("throws error when accessing apiTokens without accountId.", () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.apiTokens;
        }).toThrow(
          "Account ID is required for this operation. Please provide accountId when creating GeneralAPI instance."
        );
      });
    });

    describe("account discovery functionality: ", () => {
      const generalAPI = new General(axios);

      it("provides accounts API for listing all accounts.", () => {
        expect(generalAPI.accounts).toBeDefined();
        expect(typeof generalAPI.accounts.getAllAccounts).toBe("function");
      });

      it("does not require accountId for account discovery.", () => {
        // This should not throw an error
        expect(generalAPI.accounts).toBeDefined();
      });
    });

    describe("backward compatibility: ", () => {
      const generalAPI = new General(axios, testAccountId);

      it("maintains existing API surface for account-specific operations.", () => {
        expect(generalAPI.accountAccesses).toBeDefined();
        expect(generalAPI.permissions).toBeDefined();
        expect(generalAPI.billing).toBeDefined();
        expect(typeof generalAPI.accountAccesses.listAccountAccesses).toBe(
          "function"
        );
        expect(typeof generalAPI.permissions.getResources).toBe("function");
        expect(typeof generalAPI.billing.getCurrentBillingCycleUsage).toBe(
          "function"
        );
      });
    });

    describe("edge cases: ", () => {
      it("handles undefined accountId parameter.", () => {
        const generalAPI = new General(axios, undefined);
        expect(generalAPI.accounts).toBeDefined();
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.accountAccesses;
        }).toThrow();
      });

      it("handles null accountId parameter.", () => {
        const generalAPI = new General(axios, null as any);
        expect(generalAPI.accounts).toBeDefined();
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          generalAPI.accountAccesses;
        }).toThrow();
      });

      it("handles accountId value of 0 correctly.", () => {
        const generalAPI = new General(axios, 0);
        expect(generalAPI.accounts).toBeDefined();
        expect(generalAPI.accountAccesses).toBeDefined();
        expect(generalAPI.permissions).toBeDefined();
        expect(generalAPI.billing).toBeDefined();
        expect(typeof generalAPI.accountAccesses.listAccountAccesses).toBe(
          "function"
        );
        expect(typeof generalAPI.permissions.getResources).toBe("function");
        expect(typeof generalAPI.billing.getCurrentBillingCycleUsage).toBe(
          "function"
        );
      });
    });
  });
});
