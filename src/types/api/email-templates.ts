export interface EmailTemplate {
  id: number;
  uuid: string;
  name: string;
  subject: string;
  category: string;
  body_html: string;
  body_text?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateCreateParams {
  name: string;
  subject: string;
  category: string;
  body_html: string;
  body_text?: string;
}

export interface EmailTemplateUpdateParams {
  name?: string;
  subject?: string;
  category?: string;
  body_html?: string;
  body_text?: string;
}
