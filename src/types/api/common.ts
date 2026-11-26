/** Page-token pagination metadata returned with a paginated list response. */
export type Pagination = {
  /** Current page number. */
  token: number;
  /** Previous page number, or `null` on the first page. */
  prev_token: number | null;
  /** Next page number, or `null` on the last page. */
  next_token: number | null;
  first_url: string;
  prev_url: string | null;
  current_url: string;
  next_url: string | null;
};

/** Query params of a list endpoint with page-token pagination. */
export type PageTokenParams = {
  /**
   * Page number to retrieve. Defaults to 1. Accepts `pagination.next_token`
   * as is; `null` is the same as leaving it out.
   */
  token?: number | null;
  /**
   * Number of items per page. Maximum 100, defaults to 50. Pass the same
   * value on every page.
   */
  per_page?: number | null;
};
