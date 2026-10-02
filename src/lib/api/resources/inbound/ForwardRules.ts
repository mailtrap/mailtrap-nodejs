import { AxiosInstance } from "axios";

import CONFIG from "../../../../config";
import {
  CreateForwardRuleParams,
  ForwardRuleResponse,
  ForwardRulesListResponse,
  UpdateForwardRuleParams,
} from "../../../../types/api/inbound/forward-rules";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ForwardRulesApi {
  private client: AxiosInstance;

  private inboxesURL: string;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.inboxesURL = `${GENERAL_ENDPOINT}/api/inbound/inboxes`;
  }

  private forwardRulesURL(inboxId: number) {
    return `${this.inboxesURL}/${inboxId}/forward_rules`;
  }

  /**
   * Get all forward rules in an inbox.
   */
  public async getList(inboxId: number) {
    return this.client.get<ForwardRulesListResponse, ForwardRulesListResponse>(
      this.forwardRulesURL(inboxId)
    );
  }

  /**
   * Get a single forward rule by ID.
   */
  public async get(inboxId: number, ruleId: number) {
    const url = `${this.forwardRulesURL(inboxId)}/${ruleId}`;

    return this.client.get<ForwardRuleResponse, ForwardRuleResponse>(url);
  }

  /**
   * Create a new forward rule.
   */
  public async create(inboxId: number, params: CreateForwardRuleParams) {
    return this.client.post<ForwardRuleResponse, ForwardRuleResponse>(
      this.forwardRulesURL(inboxId),
      params
    );
  }

  /**
   * Update a forward rule by ID.
   */
  public async update(
    inboxId: number,
    ruleId: number,
    params: UpdateForwardRuleParams
  ) {
    const url = `${this.forwardRulesURL(inboxId)}/${ruleId}`;

    return this.client.patch<ForwardRuleResponse, ForwardRuleResponse>(
      url,
      params
    );
  }

  /**
   * Delete a forward rule by ID.
   */
  public async delete(inboxId: number, ruleId: number) {
    const url = `${this.forwardRulesURL(inboxId)}/${ruleId}`;

    return this.client.delete(url);
  }
}
