export type AccountType = "uk_retail" | "uk_retail_joint";

export type AccountOwner = {
  user_id: string;
  preferred_name: string;
  preferred_first_name: string;
};

export type TransactionCategory =
  | "entertainment"
  | "general"
  | "groceries"
  | "eating_out"
  | "charity"
  | "expenses"
  | "family"
  | "finances"
  | "gifts"
  | "personal_care"
  | "shopping"
  | "transport"
  | "income"
  | "savings"
  | "transfers"
  | "holidays";
