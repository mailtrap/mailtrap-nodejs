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
