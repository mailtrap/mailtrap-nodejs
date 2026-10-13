import axios from "axios";

import MarketingStatsBaseAPI from "../../../lib/api/MarketingStats";

describe("lib/api/MarketingStats: ", () => {
  const marketingStatsAPI = new MarketingStatsBaseAPI(axios);

  describe("class MarketingStatsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(marketingStatsAPI).toHaveProperty("get");
      });
    });
  });
});
