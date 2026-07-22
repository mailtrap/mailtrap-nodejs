export interface Inbox {
  id: number;
  name: string;
  address: string;
  domain_id: number;
}

/**
 * Create an inbox inside a folder. Omit `domain_id` for a standard
 * Mailtrap-hosted inbox; pass it to create a custom-domain (catch-all) inbox.
 */
export interface CreateInboxParams {
  name: string;
  domain_id?: number;
}

/** Update an inbox. Rename only. */
export interface UpdateInboxParams {
  name: string;
}
