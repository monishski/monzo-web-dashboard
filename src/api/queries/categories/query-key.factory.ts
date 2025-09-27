const BASE_QUERY_KEY = "categories";

export const categoriesQueryKeys = {
  categories: (): string[] => [BASE_QUERY_KEY],
  category: (id: string): string[] => [BASE_QUERY_KEY, id],
};
