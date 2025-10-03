import type { Category } from "@/lib/types";

const BASE_QUERY_KEY = "categories";

export const categoriesQueryKeys = {
  categories: (): string[] => [BASE_QUERY_KEY],
  category: (id: Category["id"]): string[] => [BASE_QUERY_KEY, id],
};
