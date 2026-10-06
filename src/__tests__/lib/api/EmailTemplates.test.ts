import axios from "axios";

import EmailTemplatesBaseAPI from "../../../lib/api/EmailTemplates";

describe("lib/api/EmailTemplates: ", () => {
  const accountId = 100;
  const emailTemplatesAPI = new EmailTemplatesBaseAPI(axios, accountId);

  describe("class EmailTemplatesBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(emailTemplatesAPI).toHaveProperty("create");
        expect(emailTemplatesAPI).toHaveProperty("getList");
        expect(emailTemplatesAPI).toHaveProperty("get");
        expect(emailTemplatesAPI).toHaveProperty("update");
        expect(emailTemplatesAPI).toHaveProperty("delete");
      });
    });
  });
});
