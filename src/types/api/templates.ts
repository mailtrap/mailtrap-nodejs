import { PageTokenParams, Pagination } from "./common";

export type Template = {
  id: number;
  uuid: string;
  name: string;
  subject: string;
  category: string;
  /** `null` when the template was created without an HTML body. */
  body_html: string | null;
  /** `null` when the template was created without a text body. */
  body_text: string | null;
  created_at: string;
  updated_at: string;
};

export type ListTemplatesParams = PageTokenParams;

export type CreateTemplateParams = {
  name: string;
  subject: string;
  category: string;
  body_html?: string;
  body_text?: string;
};

export type UpdateTemplateParams = Partial<CreateTemplateParams>;

export type ListTemplatesResponse = {
  data: Template[];
  pagination: Pagination;
};

export type GetTemplateResponse = {
  data: Template;
};

export type CreateTemplateResponse = {
  data: Template;
};

export type UpdateTemplateResponse = {
  data: Template;
};

/** Delete returns `204 No Content` — there is no response body. */
export type DeleteTemplateResponse = void;
