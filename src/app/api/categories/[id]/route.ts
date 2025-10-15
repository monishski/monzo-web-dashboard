import { and, eq, not } from "drizzle-orm";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";
import type { Category } from "@/lib/types";

export const GET = withAccount<
  Category,
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const [category] = await db
    .select({
      id: monzoCategories.id,
      name: monzoCategories.name,
      isMonzo: monzoCategories.isMonzo,
      createdAt: monzoCategories.createdAt,
      updatedAt: monzoCategories.updatedAt,
    })
    .from(monzoCategories)
    .where(
      and(
        eq(monzoCategories.accountId, accountId),
        eq(monzoCategories.id, categoryId)
      )
    )
    .limit(1);

  if (!category) {
    return MiddlewareResponse.notFound("Category not found");
  }

  return MiddlewareResponse.success(category);
});

export const PUT = withAccount<
  Category,
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const body = await request.json();
  const { name } = body;

  if (!name) {
    return MiddlewareResponse.badRequest("Name is required");
  }

  const [existingCategory] = await db
    .select({ id: monzoCategories.id })
    .from(monzoCategories)
    .where(
      and(
        eq(monzoCategories.name, name.trim()),
        eq(monzoCategories.accountId, accountId),
        // Exclude the current category being updated
        not(eq(monzoCategories.id, categoryId))
      )
    )
    .limit(1);

  if (existingCategory) {
    return MiddlewareResponse.conflict("Category name already exists");
  }

  const [category] = await db
    .update(monzoCategories)
    .set({ name })
    .where(
      and(
        eq(monzoCategories.id, categoryId),
        eq(monzoCategories.accountId, accountId)
      )
    )
    .returning({
      id: monzoCategories.id,
      name: monzoCategories.name,
      isMonzo: monzoCategories.isMonzo,
      createdAt: monzoCategories.createdAt,
      updatedAt: monzoCategories.updatedAt,
    });

  return MiddlewareResponse.success(category);
});

export const DELETE = withAccount<
  Pick<Category, "id">,
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const [category] = await db
    .delete(monzoCategories)
    .where(
      and(
        eq(monzoCategories.id, categoryId),
        eq(monzoCategories.accountId, accountId)
      )
    )
    .returning();

  if (!category) {
    return MiddlewareResponse.notFound("Category not found");
  }

  return MiddlewareResponse.success({
    id: category.id,
  });
});
