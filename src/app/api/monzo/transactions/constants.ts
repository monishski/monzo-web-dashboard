export const DEFAULT_CATEGORIES: {
  id: string;
  name: string;
}[] = [
  { id: "entertainment", name: "Entertainment" },
  { id: "general", name: "General" },
  { id: "groceries", name: "Groceries" },
  { id: "eating_out", name: "Eating Out" },
  { id: "charity", name: "Charity" },
  { id: "expenses", name: "Expenses" },
  { id: "family", name: "Family" },
  { id: "finances", name: "Finances" },
  { id: "gifts", name: "Gifts" },
  { id: "personal_care", name: "Personal Care" },
  { id: "shopping", name: "Shopping" },
  { id: "transport", name: "Transport" },
  { id: "income", name: "Income" },
  { id: "savings", name: "Savings" },
  { id: "transfers", name: "Transfers" },
  { id: "holidays", name: "Holidays" },
];

export const DEFAULT_CATEGORIES_IDS = DEFAULT_CATEGORIES.map((c) => c.id);
