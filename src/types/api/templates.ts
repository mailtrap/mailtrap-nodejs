export interface Template {
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

export interface TemplateCreateParams {
  name: string;
  subject: string;
  category: string;
  body_html: string;
  body_text?: string;
}

export interface TemplateUpdateParams {
  name?: string;
  subject?: string;
  category?: string;
  body_html?: string;
  body_text?: string;
}
