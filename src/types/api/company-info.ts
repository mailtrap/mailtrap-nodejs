export type CompanyInfoLevel = "business" | "individual";

export interface CompanyInfo {
  name: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  zip_code: string | null;
  privacy_policy_url: string | null;
  terms_of_service_url: string | null;
  website_url: string | null;
  info_level: CompanyInfoLevel;
}

export interface CreateCompanyInfoParams {
  name: string;
  address: string;
  city: string;
  country: string;
  zip_code: string;
  website_url: string;
  phone?: string;
  privacy_policy_url?: string;
  terms_of_service_url?: string;
  info_level?: CompanyInfoLevel;
}

export type UpdateCompanyInfoParams = Partial<CreateCompanyInfoParams>;

export interface CompanyInfoResponse {
  data: CompanyInfo;
}
