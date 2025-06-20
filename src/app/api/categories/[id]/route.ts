import { NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";

import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";

import { withAuth } from "../../middleware";

export const GET = withAuth<{ params: { id: string } }>(
  async ({ context: { params }, userId }) => {
    const [category] = await db
      .select()
      .from(monzoCategories)
      .where(
        and(
          eq(monzoCategories.userId, userId),
          eq(monzoCategories.id, params.id)
        )
      )
      .limit(1);

    return NextResponse.json(category);
  }
);

export const PUT = withAuth<{ params: { id: string } }>(
  async ({ request, context: { params }, userId }) => {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if another category with the same name exists for this user
    const existingCategory = await db
      .select()
      .from(monzoCategories)
      .where(
        and(
          eq(monzoCategories.name, name.trim()),
          eq(monzoCategories.userId, userId),
          // Exclude the current category being updated
          not(eq(monzoCategories.id, params.id))
        )
      )
      .limit(1);

    if (existingCategory.length > 0) {
      return new NextResponse("Category with this name already exists", {
        status: 400,
      });
    }

    const [category] = await db
      .update(monzoCategories)
      .set({ name })
      .where(
        and(
          eq(monzoCategories.id, params.id),
          eq(monzoCategories.userId, userId)
        )
      )
      .returning();

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category);
  }
);

export const DELETE = withAuth<{ params: { id: string } }>(
  async ({ context: { params }, userId }) => {
    const category = await db
      .delete(monzoCategories)
      .where(
        and(
          eq(monzoCategories.id, params.id),
          eq(monzoCategories.userId, userId)
        )
      )
      .returning();

    if (!category.length) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  }
);
