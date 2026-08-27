export type Suppression = {
  id: string;
  type: "hard bounce" | "spam complaint" | "unsubscription" | "manual import";
  created_at: string;
  email: string;
  sending_stream: "transactional" | "bulk";
  domain_name: string | null;
  message_bounce_category: string | null;
  message_category: string | null;
  message_client_ip: string | null;
  message_created_at: string | null;
  message_esp_response: string | null;
  message_esp_server_type: string | null;
  message_outgoing_ip: string | null;
  message_recipient_mx_name: string | null;
  message_sender_email: string | null;
  message_subject: string | null;
};

export type ListOptions = {
  email?: string;
};

export type CreateSuppressionParams = {
  email: string;
  domain_id: number;
  sending_stream: "transactional" | "bulk";
  type?: Suppression["type"];
};

export type CreateSuppressionResponse = {
  data: Suppression;
};
