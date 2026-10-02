export type ForwardRuleMatchType = "sender" | "recipient" | "header";

export type ForwardRuleOperator =
  | "equal"
  | "not_equal"
  | "contains"
  | "starts_with"
  | "ends_with"
  | "empty"
  | "not_empty";

export interface ForwardRuleCondition {
  match_type: ForwardRuleMatchType;
  operator: ForwardRuleOperator;
  value: string | null;
  header_key: string | null;
}

export interface ForwardRuleDestination {
  email: string;
}

export interface ForwardRule {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  conditions: ForwardRuleCondition[];
  destinations: ForwardRuleDestination[];
}

export interface ForwardRuleConditionParams {
  match_type: ForwardRuleMatchType;
  operator: ForwardRuleOperator;
  value?: string;
  header_key?: string;
}

export interface CreateForwardRuleParams {
  name: string;
  conditions?: ForwardRuleConditionParams[];
  destinations?: ForwardRuleDestination[];
}

export interface UpdateForwardRuleParams {
  name?: string;
  conditions?: ForwardRuleConditionParams[];
  destinations?: ForwardRuleDestination[];
}

export interface ForwardRuleResponse {
  data: ForwardRule;
}

export interface ForwardRulesListResponse {
  data: ForwardRule[];
}

export type ForwardOutcomeStatus = "forwarded" | "rejected";

export interface ForwardOutcome {
  rule_id: number;
  rule_name: string | null;
  destination: string;
  status: ForwardOutcomeStatus;
  reason: string | null;
  message_id: string | null;
}
