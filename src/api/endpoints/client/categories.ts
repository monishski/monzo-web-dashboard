import type { Category } from "@/lib/types";

import { apiHttpClient } from "./api-http-client";

export const fetchCategories = async (): Promise<Category[]> =>
  await apiHttpClient.get({
    url: "/categories",
  });

export const fetchCategory = async (
  id: Category["id"]
): Promise<Category> =>
  await apiHttpClient.get({
    url: `/categories/${id}`,
  });

export const createCategory = async (
  payload: Pick<Category, "name">
): Promise<Category> =>
  await apiHttpClient.post({
    url: "/categories",
    payload,
  });

export const updateCategory = async (
  id: Category["id"],
  payload: Pick<Category, "name">
): Promise<Category> =>
  await apiHttpClient.put({
    url: `/categories/${id}`,
    payload,
  });

export const deleteCategory = async (
  id: Category["id"]
): Promise<Pick<Category, "id">> =>
  await apiHttpClient.delete({
    url: `/categories/${id}`,
  });
