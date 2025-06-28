import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";
import type { Category } from "@/lib/types/category";

export const GET = withAccount<Category[]>(async ({ accountId }) => {
  const dbCategories = await db.query.monzoCategories.findMany({
    columns: { accountId: false },
    where: eq(monzoCategories.accountId, accountId),
  });

  const categories: Category[] = dbCategories.map((dbCategory) => {
    const { createdAt: created, updatedAt: updated } = dbCategory;
    return {
      ...dbCategory,
      createdAt: created instanceof Date ? created.toISOString() : created,
      updatedAt: updated instanceof Date ? updated.toISOString() : updated,
    };
  });

  return NextResponse.json({ success: true, data: categories });
});

export const POST = withAccount<Category>(
  async ({ request, accountId }) => {
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
        eq(monzoCategories.accountId, accountId)
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
      .insert(monzoCategories)
      .values({
        id: crypto.randomUUID(),
        name: name.trim(),
        isMonzo: false,
        accountId,
      })
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
  }
);
