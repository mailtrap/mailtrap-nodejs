export type TrackingOptOut = {
  id: string;
  email: string;
  created_at: string;
  domain_name: string | null;
};

export type ListTrackingOptOutsParams = {
  email?: string;
  start_time?: string;
  end_time?: string;
  last_id?: string;
};

export type ListTrackingOptOutsResponse = {
  data: TrackingOptOut[];
  last_id: string | null;
};

export type CreateTrackingOptOutParams = {
  email: string;
  domain_id: number;
};

export type CreateTrackingOptOutResponse = {
  data: TrackingOptOut;
};
