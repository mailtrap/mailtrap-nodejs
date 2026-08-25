import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import CompanyInfoBaseAPI from "../../../../lib/api/CompanyInfo";
import { CompanyInfo } from "../../../../types/api/company-info";

describe("lib/api/CompanyInfo: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);

  // Add the response interceptor that returns response.data
  axiosInstance.interceptors.response.use((response) => response.data);

  const companyInfoAPI = new CompanyInfoBaseAPI(axiosInstance);
  const domainId = 999;
  const companyInfoURL = `https://mailtrap.io/api/domains/${domainId}/company_info`;

  describe("class CompanyInfoBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(companyInfoAPI).toHaveProperty("get");
        expect(companyInfoAPI).toHaveProperty("create");
        expect(companyInfoAPI).toHaveProperty("update");
      });
    });

    describe("companyInfo.get(): ", () => {
      it("should get the company info of a sending domain.", async () => {
        const mockCompanyInfo: CompanyInfo = {
          name: "Mailtrap",
          address: "123 Main St",
          city: "San Francisco",
          country: "US",
          phone: "+1-555-0100",
          zip_code: "94105",
          privacy_policy_url: "https://mailtrap.io/privacy",
          terms_of_service_url: "https://mailtrap.io/terms",
          website_url: "https://mailtrap.io",
          info_level: "business",
        };

        mock.onGet(companyInfoURL).reply(200, { data: mockCompanyInfo });

        const result = await companyInfoAPI.get(domainId);

        expect(result).toEqual({ data: mockCompanyInfo });
      });
    });

    describe("companyInfo.create(): ", () => {
      it("should create the company info of a sending domain.", async () => {
        const createParams = {
          name: "Mailtrap",
          address: "123 Main St",
          city: "San Francisco",
          country: "US",
          zip_code: "94105",
          website_url: "https://mailtrap.io",
          info_level: "business" as const,
        };

        const mockCompanyInfo: CompanyInfo = {
          ...createParams,
          phone: null,
          privacy_policy_url: null,
          terms_of_service_url: null,
        };

        mock
          .onPost(companyInfoURL, { company_info: createParams })
          .reply(200, { data: mockCompanyInfo });

        const result = await companyInfoAPI.create(domainId, createParams);

        expect(result).toEqual({ data: mockCompanyInfo });
      });
    });

    describe("companyInfo.update(): ", () => {
      it("should update the company info of a sending domain.", async () => {
        const updateParams = {
          city: "New York",
          zip_code: "10001",
        };

        const mockCompanyInfo: CompanyInfo = {
          name: "Mailtrap",
          address: "123 Main St",
          city: "New York",
          country: "US",
          phone: null,
          zip_code: "10001",
          privacy_policy_url: null,
          terms_of_service_url: null,
          website_url: "https://mailtrap.io",
          info_level: "business",
        };

        mock
          .onPatch(companyInfoURL, { company_info: updateParams })
          .reply(200, { data: mockCompanyInfo });

        const result = await companyInfoAPI.update(domainId, updateParams);

        expect(result).toEqual({ data: mockCompanyInfo });
      });
    });
  });
});
