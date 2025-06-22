import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";
import type { Category } from "@/lib/types/category";

export const GET = withAuth<Category[]>(async ({ userId }) => {
  const dbCategories = await db.query.monzoCategories.findMany({
    columns: { userId: false },
    where: eq(monzoCategories.userId, userId),
  });

  const categories: Category[] = dbCategories.map((dbCategory) => {
    const { createdAt, updatedAt } = dbCategory;
    return {
      ...dbCategory,
      createdAt:
        createdAt instanceof Date ? createdAt.toISOString() : createdAt,
      updatedAt:
        updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    };
  });

  return NextResponse.json({ success: true, data: categories });
});

export const POST = withAuth<Category>(async ({ request, userId }) => {
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
      eq(monzoCategories.userId, userId)
    ),
    columns: { id: true },
  });

  if (existingCategory) {
    return NextResponse.json(
      { success: false, error: "Category with this name already exists" },
      { status: 400 }
    );
  }

  const [dbCategory] = await db
    .insert(monzoCategories)
    .values({
      id: crypto.randomUUID(),
      name: name.trim(),
      isMonzo: false,
      userId,
    })
    .returning();

  const { createdAt, updatedAt } = dbCategory;
  const category = {
    id: dbCategory.id,
    name: dbCategory.name,
    isMonzo: dbCategory.isMonzo,
    createdAt:
      createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt:
      updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
  };

  return NextResponse.json({ success: true, data: category });
});
