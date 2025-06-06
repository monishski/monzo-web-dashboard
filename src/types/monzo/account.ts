type MonzoOwner = {
  user_id: string;
  preferred_name: string;
  preferred_first_name: string;
};

type MonzoIban = {
  unformatted: string;
  formatted: string;
  bic: string;
  usage_description: string;
  usage_description_web: string;
};

type MonzoPaymentDetails = {
  locale_uk: {
    account_number: string;
    sort_code: string;
  };
  iban: MonzoIban;
};

type MonzoAccountType = "uk_retail" | "uk_retail_joint";

export type MonzoAccount = {
  id: string;
  closed: boolean;
  created: string;
  description: string;
  type: MonzoAccountType;
  owner_type: string;
  is_flex: boolean;
  product_type: string;
  closed_account_app_access: boolean;
  currency: string;
  legal_entity: string;
  country_code: string;
  country_code_alpha3: string;
  owners: MonzoOwner[];
  account_number: string;
  sort_code: string;
  payment_details: MonzoPaymentDetails;
};
