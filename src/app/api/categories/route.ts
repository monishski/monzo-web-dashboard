import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";
import type { Category } from "@/types/category";

export const GET = withAuth<Category[]>(async ({ userId }) => {
  const categories = await db
    .select({
      id: monzoCategories.id,
      name: monzoCategories.name,
      isMonzo: monzoCategories.isMonzo,
      createdAt: monzoCategories.createdAt,
      updatedAt: monzoCategories.updatedAt,
    })
    .from(monzoCategories)
    .where(eq(monzoCategories.userId, userId));

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

  const existingCategory = await db
    .select()
    .from(monzoCategories)
    .where(
      and(
        eq(monzoCategories.name, name),
        eq(monzoCategories.userId, userId)
      )
    )
    .limit(1);

  if (existingCategory.length > 0) {
    return NextResponse.json(
      { success: false, error: "Category with this name already exists" },
      { status: 400 }
    );
  }

  const [category] = await db
    .insert(monzoCategories)
    .values({
      id: crypto.randomUUID(),
      name: name.trim(),
      isMonzo: false,
      userId,
    })
    .returning();

  return NextResponse.json({ success: true, data: category });
});
