import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import DomainsBaseAPI from "../../../../lib/api/Domains";
import SendingDomainsBaseAPI from "../../../../lib/api/SendingDomains";
import DomainsApi from "../../../../lib/api/resources/Domains";
import SendingDomainsApi from "../../../../lib/api/resources/SendingDomains";
import {
  Domain,
  DnsRecord,
  DomainPermissions,
} from "../../../../types/api/domains";
import { SendingDomainsResponse } from "../../../../types/api/sending-domains";

describe("lib/api/Domains: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);

  // Add the response interceptor that returns response.data
  axiosInstance.interceptors.response.use((response) => response.data);

  const testAccountId = 100;
  const domainsAPI = new DomainsBaseAPI(axiosInstance, testAccountId);

  describe("class DomainsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(domainsAPI).toHaveProperty("get");
        expect(domainsAPI).toHaveProperty("getList");
        expect(domainsAPI).toHaveProperty("create");
        expect(domainsAPI).toHaveProperty("update");
        expect(domainsAPI).toHaveProperty("delete");
        expect(domainsAPI).toHaveProperty("sendSetupInstructions");
      });
    });

    describe("domains.getList(): ", () => {
      it("should get domains list.", async () => {
        const mockDnsRecords: DnsRecord[] = [
          {
            key: "verification",
            domain: "ve6wza2rbpe60x7z.example.com",
            type: "CNAME",
            value: "smtp.mailtrap.live",
            status: "pass",
            name: "ve6wza2rbpe60x7z",
          },
          {
            key: "spf",
            domain: "example.com",
            type: "TXT",
            value: "v=spf1 include:_spf.smtp.mailtrap.live ~all",
            status: "pass",
            name: "",
          },
        ];

        const mockPermissions: DomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockDomains: Domain[] = [
          {
            id: 435,
            domain_name: "example.com",
            demo: false,
            compliance_status: "compliant",
            dns_verified: true,
            dns_verified_at: "2024-12-26T09:40:44.161Z",
            dns_records: mockDnsRecords,
            open_tracking_enabled: true,
            click_tracking_enabled: true,
            tracking_opt_out_enabled: false,
            auto_unsubscribe_link_enabled: true,
            custom_domain_tracking_enabled: true,
            health_alerts_enabled: true,
            critical_alerts_enabled: true,
            alert_recipient_email: "john.doe@example.com",
            inbound_enabled: true,
            inbound_verified: true,
            permissions: mockPermissions,
          },
        ];

        mock
          .onGet(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains`
          )
          .reply(200, { data: mockDomains });

        const result = await domainsAPI.getList();

        expect(result).toEqual({ data: mockDomains });
      });
    });

    describe("domains.get(): ", () => {
      it("should get a single domain by id.", async () => {
        const mockDnsRecords: DnsRecord[] = [
          {
            key: "verification",
            domain: "ve6wza2rbpe60x7z.example.com",
            type: "CNAME",
            value: "smtp.mailtrap.live",
            status: "pass",
            name: "ve6wza2rbpe60x7z",
          },
        ];

        const mockPermissions: DomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockDomain: Domain = {
          id: 999,
          domain_name: "example.com",
          demo: false,
          compliance_status: "compliant",
          dns_verified: true,
          dns_verified_at: "2024-12-26T09:40:44.161Z",
          dns_records: mockDnsRecords,
          open_tracking_enabled: true,
          click_tracking_enabled: true,
          tracking_opt_out_enabled: false,
          auto_unsubscribe_link_enabled: true,
          custom_domain_tracking_enabled: true,
          health_alerts_enabled: true,
          critical_alerts_enabled: true,
          alert_recipient_email: "john.doe@example.com",
          inbound_enabled: true,
          inbound_verified: true,
          permissions: mockPermissions,
        };

        mock
          .onGet(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${mockDomain.id}`
          )
          .reply(200, mockDomain);

        const result = await domainsAPI.get(mockDomain.id);

        expect(result).toEqual(mockDomain);
      });
    });

    describe("domains.create(): ", () => {
      it("should create a new domain.", async () => {
        const mockDnsRecords: DnsRecord[] = [
          {
            key: "verification",
            domain: "ve6wza2rbpe60x7z.newdomain.com",
            type: "CNAME",
            value: "smtp.mailtrap.live",
            status: "pass",
            name: "ve6wza2rbpe60x7z",
          },
        ];

        const mockPermissions: DomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockDomain: Domain = {
          id: 436,
          domain_name: "newdomain.com",
          demo: false,
          compliance_status: "pending",
          dns_verified: false,
          dns_verified_at: "",
          dns_records: mockDnsRecords,
          open_tracking_enabled: true,
          click_tracking_enabled: true,
          tracking_opt_out_enabled: false,
          auto_unsubscribe_link_enabled: true,
          custom_domain_tracking_enabled: true,
          health_alerts_enabled: true,
          critical_alerts_enabled: true,
          alert_recipient_email: "admin@newdomain.com",
          inbound_enabled: true,
          inbound_verified: true,
          permissions: mockPermissions,
        };

        const createParams = {
          domain_name: "newdomain.com",
        };

        mock
          .onPost(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains`,
            { sending_domain: createParams }
          )
          .reply(201, mockDomain);

        const result = await domainsAPI.create(createParams);

        expect(result).toEqual(mockDomain);
      });
    });

    describe("domains.update(): ", () => {
      it("should update a domain.", async () => {
        const mockPermissions: DomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockDomain: Domain = {
          id: 435,
          domain_name: "example.com",
          demo: false,
          compliance_status: "compliant",
          dns_verified: true,
          dns_verified_at: "2024-12-26T09:40:44.161Z",
          dns_records: [],
          open_tracking_enabled: true,
          click_tracking_enabled: true,
          tracking_opt_out_enabled: true,
          auto_unsubscribe_link_enabled: false,
          custom_domain_tracking_enabled: true,
          health_alerts_enabled: true,
          critical_alerts_enabled: true,
          alert_recipient_email: "john.doe@example.com",
          inbound_enabled: true,
          inbound_verified: true,
          permissions: mockPermissions,
        };

        const updateParams = {
          open_tracking_enabled: true,
          click_tracking_enabled: true,
          tracking_opt_out_enabled: true,
          auto_unsubscribe_link_enabled: false,
          inbound_enabled: true,
        };

        mock
          .onPatch(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${mockDomain.id}`,
            { sending_domain: updateParams }
          )
          .reply(200, mockDomain);

        const result = await domainsAPI.update(mockDomain.id, updateParams);

        expect(result).toEqual(mockDomain);
      });
    });

    describe("domains.delete(): ", () => {
      it("should delete a domain by id.", async () => {
        const domainId = 999;

        mock
          .onDelete(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${domainId}`
          )
          .reply(204);

        const result = await domainsAPI.delete(domainId);

        expect(result).toBeUndefined();
      });
    });

    describe("domains.sendSetupInstructions(): ", () => {
      it("should send setup instructions for a domain.", async () => {
        const domainId = 999;
        const email = "admin@example.com";

        mock
          .onPost(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${domainId}/send_setup_instructions`
          )
          .reply(204);

        const result = await domainsAPI.sendSetupInstructions(domainId, email);

        expect(result).toBeUndefined();
      });
    });
  });

  describe("deprecated SendingDomains names: ", () => {
    it("SendingDomainsBaseAPI is a DomainsBaseAPI calling the same endpoints.", async () => {
      const sendingDomainsAPI = new SendingDomainsBaseAPI(
        axiosInstance,
        testAccountId
      );
      mock
        .onGet(
          `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains`
        )
        .reply(200, { data: [] });

      const result: SendingDomainsResponse = await sendingDomainsAPI.getList();

      expect(sendingDomainsAPI).toBeInstanceOf(DomainsBaseAPI);
      expect(result).toEqual({ data: [] });
    });

    it("SendingDomainsApi is a DomainsApi.", () => {
      expect(
        new SendingDomainsApi(axiosInstance, testAccountId)
      ).toBeInstanceOf(DomainsApi);
    });
  });
});
