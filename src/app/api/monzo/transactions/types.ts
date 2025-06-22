import type { TransactionMerchant } from "@/lib/types";

type MonzoTransactionMetadata = {
  card_acceptor_website?: string;
  ledger_committed_timestamp_earliest?: string;
  ledger_committed_timestamp_latest?: string;
  ledger_insertion_id?: string;
  mastercard_approval_type?: string;
  mastercard_auth_message_id?: string;
  mastercard_card_id?: string;
  mastercard_clearing_message_id?: string;
  mastercard_lifecycle_id?: string;
  mcc?: string;
  standin_correlation_id?: string;
  token_unique_reference?: string;
  tokenization_method?: string;
};

export type MonzoTransaction = {
  id: string;
  created: string;
  description: string;
  amount: number;
  fees: unknown;
  currency: string;
  merchant?: TransactionMerchant;
  merchant_feedback_uri?: string;
  notes: string;
  metadata: MonzoTransactionMetadata;
  labels: unknown;
  attachments: unknown;
  international: unknown;
  category: string;
  categories: {
    [key in string]?: number;
  };
  is_load: boolean;
  settled: string;
  local_amount: number;
  local_currency: string;
  updated: string;
  account_id: string;
  user_id: string;
  counterparty: unknown;
  scheme: string;
  dedupe_id: string;
  originator: boolean;
  include_in_spending: boolean;
  can_be_excluded_from_breakdown: boolean;
  can_be_made_subscription: boolean;
  can_split_the_bill: boolean;
  can_add_to_tab: boolean;
  can_match_transactions_in_categorization: boolean;
  amount_is_pending: boolean;
  atm_fees_detailed: unknown;
  parent_account_id: string;
};
