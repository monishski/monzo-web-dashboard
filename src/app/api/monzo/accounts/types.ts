import type { AccountOwner, AccountType } from "@/lib/types";

type MonzoAccountIban = {
  unformatted: string;
  formatted: string;
  bic: string;
  usage_description: string;
  usage_description_web: string;
};

type MonzoAccountPaymentDetails = {
  locale_uk: {
    account_number: string;
    sort_code: string;
  };
  iban: MonzoAccountIban;
};

export type MonzoAccount = {
  id: string;
  closed: boolean;
  created: string;
  description: string;
  type: AccountType;
  owner_type: string;
  is_flex: boolean;
  product_type: string;
  closed_account_app_access: boolean;
  currency: string;
  legal_entity: string;
  country_code: string;
  country_code_alpha3: string;
  owners: AccountOwner[];
  account_number: string;
  sort_code: string;
  payment_details: MonzoAccountPaymentDetails;
};
