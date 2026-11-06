import {
  CreateDomainParams,
  Domain,
  DomainPermissions,
  DomainsResponse,
  UpdateDomainParams,
} from "./domains";

export type { DnsRecord } from "./domains";

/** @deprecated Use `DomainPermissions` instead. */
export type SendingDomainPermissions = DomainPermissions;

/** @deprecated Use `Domain` instead. */
export type SendingDomain = Domain;

/** @deprecated Use `CreateDomainParams` instead. */
export type CreateSendingDomainParams = CreateDomainParams;

/** @deprecated Use `DomainsResponse` instead. */
export type SendingDomainsResponse = DomainsResponse;

/** @deprecated Use `UpdateDomainParams` instead. */
export type UpdateSendingDomainParams = UpdateDomainParams;
