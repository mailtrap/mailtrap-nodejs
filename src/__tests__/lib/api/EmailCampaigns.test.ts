import axios from "axios";

import EmailCampaignsBaseAPI from "../../../lib/api/EmailCampaigns";

describe("lib/api/EmailCampaigns: ", () => {
  const emailCampaignsAPI = new EmailCampaignsBaseAPI(axios);

  describe("class EmailCampaignsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(emailCampaignsAPI).toHaveProperty("getList");
        expect(emailCampaignsAPI).toHaveProperty("create");
        expect(emailCampaignsAPI).toHaveProperty("get");
        expect(emailCampaignsAPI).toHaveProperty("update");
        expect(emailCampaignsAPI).toHaveProperty("delete");
        expect(emailCampaignsAPI).toHaveProperty("start");
        expect(emailCampaignsAPI).toHaveProperty("schedule");
        expect(emailCampaignsAPI).toHaveProperty("cancel");
        expect(emailCampaignsAPI).toHaveProperty("terminate");
        expect(emailCampaignsAPI).toHaveProperty("reset");
        expect(emailCampaignsAPI).toHaveProperty("getStats");
      });
    });
  });
});
