import { NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";
import type { Category } from "@/lib/types/category";

export const GET = withAuth<Category, { params: Promise<{ id: string }> }>(
  async ({ context: { params }, userId }) => {
    const { id: categoryId } = await params;

    const dbCategory = await db.query.monzoCategories.findFirst({
      columns: { userId: false },
      where: and(
        eq(monzoCategories.userId, userId),
        eq(monzoCategories.id, categoryId)
      ),
    });

    if (!dbCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const { createdAt, updatedAt } = dbCategory;
    const category = {
      ...dbCategory,
      createdAt:
        createdAt instanceof Date ? createdAt.toISOString() : createdAt,
      updatedAt:
        updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    };

    return NextResponse.json({ success: true, data: category });
  }
);

export const PUT = withAuth<Category, { params: Promise<{ id: string }> }>(
  async ({ request, context: { params }, userId }) => {
    const { id: categoryId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if another category with the same name exists for this user
    const existingCategory = await db.query.monzoCategories.findFirst({
      where: and(
        eq(monzoCategories.name, name.trim()),
        eq(monzoCategories.userId, userId),
        // Exclude the current category being updated
        not(eq(monzoCategories.id, categoryId))
      ),
      columns: { id: true },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category with this name already exists",
        },
        { status: 400 }
      );
    }

    const [dbCategory] = await db
      .update(monzoCategories)
      .set({ name })
      .where(
        and(
          eq(monzoCategories.id, categoryId),
          eq(monzoCategories.userId, userId)
        )
      )
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
  }
);

export const DELETE = withAuth<null, { params: Promise<{ id: string }> }>(
  async ({ context: { params }, userId }) => {
    const { id: categoryId } = await params;

    const category = await db
      .delete(monzoCategories)
      .where(
        and(
          eq(monzoCategories.id, categoryId),
          eq(monzoCategories.userId, userId)
        )
      )
      .returning();

    if (!category.length) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  }
);
