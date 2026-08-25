import axios, { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";

import SendingDomainsBaseAPI from "../../../../lib/api/SendingDomains";
import {
  SendingDomain,
  DnsRecord,
  SendingDomainPermissions,
} from "../../../../types/api/sending-domains";

describe("lib/api/SendingDomains: ", () => {
  const axiosInstance: AxiosInstance = axios.create();
  const mock = new MockAdapter(axiosInstance);

  // Add the response interceptor that returns response.data
  axiosInstance.interceptors.response.use((response) => response.data);

  const testAccountId = 100;
  const sendingDomainsAPI = new SendingDomainsBaseAPI(
    axiosInstance,
    testAccountId
  );

  describe("class SendingDomainsBaseAPI(): ", () => {
    describe("init: ", () => {
      it("initializes with all necessary params.", () => {
        expect(sendingDomainsAPI).toHaveProperty("get");
        expect(sendingDomainsAPI).toHaveProperty("getList");
        expect(sendingDomainsAPI).toHaveProperty("create");
        expect(sendingDomainsAPI).toHaveProperty("update");
        expect(sendingDomainsAPI).toHaveProperty("delete");
        expect(sendingDomainsAPI).toHaveProperty("sendSetupInstructions");
      });
    });

    describe("sendingDomains.getList(): ", () => {
      it("should get sending domains list.", async () => {
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

        const mockPermissions: SendingDomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockSendingDomains: SendingDomain[] = [
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
          .reply(200, { data: mockSendingDomains });

        const result = await sendingDomainsAPI.getList();

        expect(result).toEqual({ data: mockSendingDomains });
      });
    });

    describe("sendingDomains.get(): ", () => {
      it("should get a single sending domain by id.", async () => {
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

        const mockPermissions: SendingDomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockSendingDomain: SendingDomain = {
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
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${mockSendingDomain.id}`
          )
          .reply(200, mockSendingDomain);

        const result = await sendingDomainsAPI.get(mockSendingDomain.id);

        expect(result).toEqual(mockSendingDomain);
      });
    });

    describe("sendingDomains.create(): ", () => {
      it("should create a new sending domain.", async () => {
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

        const mockPermissions: SendingDomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockSendingDomain: SendingDomain = {
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
          .reply(201, mockSendingDomain);

        const result = await sendingDomainsAPI.create(createParams);

        expect(result).toEqual(mockSendingDomain);
      });
    });

    describe("sendingDomains.update(): ", () => {
      it("should update a sending domain.", async () => {
        const mockPermissions: SendingDomainPermissions = {
          can_read: true,
          can_update: true,
          can_destroy: true,
        };

        const mockSendingDomain: SendingDomain = {
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
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${mockSendingDomain.id}`,
            { sending_domain: updateParams }
          )
          .reply(200, mockSendingDomain);

        const result = await sendingDomainsAPI.update(
          mockSendingDomain.id,
          updateParams
        );

        expect(result).toEqual(mockSendingDomain);
      });
    });

    describe("sendingDomains.delete(): ", () => {
      it("should delete a sending domain by id.", async () => {
        const sendingDomainId = 999;

        mock
          .onDelete(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${sendingDomainId}`
          )
          .reply(204);

        const result = await sendingDomainsAPI.delete(sendingDomainId);

        expect(result).toBeUndefined();
      });
    });

    describe("sendingDomains.sendSetupInstructions(): ", () => {
      it("should send setup instructions for a sending domain.", async () => {
        const sendingDomainId = 999;
        const email = "admin@example.com";

        mock
          .onPost(
            `https://mailtrap.io/api/accounts/${testAccountId}/sending_domains/${sendingDomainId}/send_setup_instructions`
          )
          .reply(204);

        const result = await sendingDomainsAPI.sendSetupInstructions(
          sendingDomainId,
          email
        );

        expect(result).toBeUndefined();
      });
    });
  });
});
