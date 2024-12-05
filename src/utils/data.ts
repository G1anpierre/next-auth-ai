export const columns = [
  { name: "CATEGORY", uid: "category" },
  { name: "AMOUNT", uid: "amount" },
  { name: "RECURRING", uid: "recurring" },
  { name: "ACTIONS", uid: "actions" },
];

export const categories = [
  {
    id: 1,
    category: "Food",
    amount: 100,
    recurring: true,
    actions: "Delete",
  },
];

export const ideas = [
  {
    title: "Analyze my spending patterns this month",
    description: "show trends and categories",
  },
  {
    title: "Compare my expenses with last month",
    description: "highlight major differences",
  },
  {
    title: "Suggest ways to reduce my expenses",
    description: "based on my spending habits",
  },
  {
    title: "Show my recurring expenses summary",
    description: "calculate monthly commitments",
  },
];

export const SelectExpensesOptions = [
  { key: "food", value: "Food" },
  { key: "transportation", value: "Transportation" },
  { key: "housing", value: "Housing" },
  { key: "utilities", value: "Utilities" },
  { key: "entertainment", value: "Entertainment" },
  { key: "health", value: "Health" },
  { key: "education", value: "Education" },
  { key: "other", value: "Other" },
];
