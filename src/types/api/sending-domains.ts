export interface DnsRecord {
  key: string;
  domain: string;
  type: string;
  value: string;
  status: string;
  name: string;
}

export interface SendingDomainPermissions {
  can_read: boolean;
  can_update: boolean;
  can_destroy: boolean;
}

export interface SendingDomain {
  id: number;
  domain_name: string;
  demo: boolean;
  compliance_status: string;
  dns_verified: boolean;
  dns_verified_at: string | null;
  dns_records: DnsRecord[];
  open_tracking_enabled: boolean;
  click_tracking_enabled: boolean;
  auto_unsubscribe_link_enabled: boolean;
  custom_domain_tracking_enabled: boolean;
  health_alerts_enabled: boolean;
  critical_alerts_enabled: boolean;
  alert_recipient_email: string | null;
  inbound_enabled: boolean;
  inbound_verified: boolean;
  permissions: SendingDomainPermissions;
}

export interface CreateSendingDomainParams {
  domain_name: string;
}

export interface SendingDomainsResponse {
  data: SendingDomain[];
}
