export type SubAccount = {
  id: number;
  name: string;
};

export type CreateSubAccountParams = {
  name: string;
};

/** Delete returns `204 No Content` – there is no response body. */
export type DeleteSubAccountResponse = void;
