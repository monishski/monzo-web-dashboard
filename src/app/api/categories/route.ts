import { and, eq } from "drizzle-orm";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { db, monzoCategories } from "@/lib/db";
import type { Category } from "@/lib/types";

export const GET = withAccount<Category[]>(async ({ accountId }) => {
  const categories = await db
    .select({
      id: monzoCategories.id,
      name: monzoCategories.name,
      isMonzo: monzoCategories.isMonzo,
      createdAt: monzoCategories.createdAt,
      updatedAt: monzoCategories.updatedAt,
    })
    .from(monzoCategories)
    .where(eq(monzoCategories.accountId, accountId));

  return MiddlewareResponse.success(categories);
});

export const POST = withAccount<Category>(
  async ({ request, accountId }) => {
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
          eq(monzoCategories.accountId, accountId)
        )
      )
      .limit(1);

    if (existingCategory) {
      return MiddlewareResponse.conflict("Category name already exists");
    }

    const [category] = await db
      .insert(monzoCategories)
      .values({
        id: crypto.randomUUID(),
        name: name.trim(),
        isMonzo: false,
        accountId,
      })
      .returning({
        id: monzoCategories.id,
        name: monzoCategories.name,
        isMonzo: monzoCategories.isMonzo,
        createdAt: monzoCategories.createdAt,
        updatedAt: monzoCategories.updatedAt,
      });

    return MiddlewareResponse.created(category);
  }
);
