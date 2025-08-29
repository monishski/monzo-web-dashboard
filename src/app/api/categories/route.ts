import { and, eq } from "drizzle-orm";
import omit from "lodash/omit";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db, monzoCategories } from "@/lib/db";
import type { Category } from "@/lib/types";

export const GET = withAccount<Category[]>(async ({ accountId }) => {
  const categories = await db.query.monzoCategories.findMany({
    columns: { accountId: false },
    where: eq(monzoCategories.accountId, accountId),
  });

  return MiddlewareResponse.success(categories);
});

export const POST = withAccount<Category>(
  async ({ request, accountId }) => {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return MiddlewareResponse.badRequest("Name is required");
    }

    const existingCategory = await db.query.monzoCategories.findFirst({
      where: and(
        eq(monzoCategories.name, name.trim()),
        eq(monzoCategories.accountId, accountId)
      ),
      columns: { id: true },
    });

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
      .returning();

    return MiddlewareResponse.created(omit(category, ["accountId"]));
  }
);
