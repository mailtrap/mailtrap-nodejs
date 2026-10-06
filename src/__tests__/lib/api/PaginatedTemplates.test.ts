import axios from "axios";

import PaginatedTemplatesBaseAPI from "../../../lib/api/PaginatedTemplates";

describe("lib/api/PaginatedTemplates: ", () => {
  const accountId = 100;
  const paginatedTemplatesAPI = new PaginatedTemplatesBaseAPI(axios, accountId);

  describe("class PaginatedTemplatesBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(paginatedTemplatesAPI).toHaveProperty("create");
        expect(paginatedTemplatesAPI).toHaveProperty("getList");
        expect(paginatedTemplatesAPI).toHaveProperty("get");
        expect(paginatedTemplatesAPI).toHaveProperty("update");
        expect(paginatedTemplatesAPI).toHaveProperty("delete");
      });
    });
  });
});
