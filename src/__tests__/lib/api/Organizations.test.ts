import axios from "axios";

import OrganizationsBaseAPI from "../../../lib/api/Organizations";

describe("lib/api/Organizations: ", () => {
  const organizationId = 1001;
  const organizationsAPI = new OrganizationsBaseAPI(axios, organizationId);

  describe("class OrganizationsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("exposes subAccounts resource.", () => {
        expect(organizationsAPI).toHaveProperty("subAccounts");
        expect(typeof organizationsAPI.subAccounts.getList).toBe("function");
      });
    });
  });
});
