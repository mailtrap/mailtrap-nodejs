import { Pagination } from "./common";

export type Template = {
  id: number;
  uuid: string;
  name: string;
  subject: string;
  category: string;
  body_html: string;
  body_text?: string;
  created_at: string;
  updated_at: string;
};

export type ListTemplatesParams = {
  /** Page number to retrieve (page-token pagination). Defaults to 1. */
  token?: number;
  /** Number of templates per page. Maximum 100, defaults to 50. */
  per_page?: number;
};

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
