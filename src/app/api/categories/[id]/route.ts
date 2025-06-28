import { NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";
import type { Category } from "@/lib/types/category";

export const GET = withAccount<
  Category,
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const dbCategory = await db.query.monzoCategories.findFirst({
    columns: { accountId: false },
    where: and(
      eq(monzoCategories.accountId, accountId),
      eq(monzoCategories.id, categoryId)
    ),
  });

  if (!dbCategory) {
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    );
  }

  const { createdAt: created, updatedAt: updated } = dbCategory;
  const category: Category = {
    ...dbCategory,
    createdAt: created instanceof Date ? created.toISOString() : created,
    updatedAt: updated instanceof Date ? updated.toISOString() : updated,
  };

  return NextResponse.json({ success: true, data: category });
});

export const PUT = withAccount<
  Category,
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const body = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 }
    );
  }

  const existingCategory = await db.query.monzoCategories.findFirst({
    where: and(
      eq(monzoCategories.name, name.trim()),
      eq(monzoCategories.accountId, accountId),
      // Exclude the current category being updated
      not(eq(monzoCategories.id, categoryId))
    ),
    columns: { id: true },
  });

  if (existingCategory) {
    return NextResponse.json(
      { success: false, error: "Category name already exists" },
      { status: 400 }
    );
  }

  const [dbCategory] = await db
    .update(monzoCategories)
    .set({ name })
    .where(
      and(
        eq(monzoCategories.id, categoryId),
        eq(monzoCategories.accountId, accountId)
      )
    )
    .returning();

  const { createdAt: created, updatedAt: updated } = dbCategory;
  const category: Category = {
    id: dbCategory.id,
    name: dbCategory.name,
    isMonzo: dbCategory.isMonzo,
    createdAt: created instanceof Date ? created.toISOString() : created,
    updatedAt: updated instanceof Date ? updated.toISOString() : updated,
  };

  return NextResponse.json({ success: true, data: category });
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
    return NextResponse.json(
      { success: false, error: "Category not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: { id: category.id } },
    { status: 200 }
  );
});
