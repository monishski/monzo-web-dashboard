import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";

import { withAuth } from "../middleware";

export const GET = withAuth(async ({ userId }) => {
  const categories = await db
    .select()
    .from(monzoCategories)
    .where(eq(monzoCategories.userId, userId));

  return NextResponse.json({ categories });
});

export const POST = withAuth(async ({ request, userId }) => {
  const body = await request.json();
  const { name } = body;

  if (!name) {
    return new NextResponse("Name is required", { status: 400 });
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
    return new NextResponse("Category with this name already exists", {
      status: 400,
    });
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

  return NextResponse.json(category);
});
