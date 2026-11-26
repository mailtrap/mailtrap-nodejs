import axios from "axios";

import SubscriptionTopicsBaseAPI from "../../../lib/api/SubscriptionTopics";

describe("lib/api/SubscriptionTopics: ", () => {
  const subscriptionTopicsAPI = new SubscriptionTopicsBaseAPI(axios);

  describe("class SubscriptionTopicsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(subscriptionTopicsAPI).toHaveProperty("getList");
        expect(subscriptionTopicsAPI).toHaveProperty("get");
      });
    });
  });
});
