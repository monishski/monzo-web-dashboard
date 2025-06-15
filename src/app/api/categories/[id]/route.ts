import { NextResponse } from "next/server";
import { and, eq, not } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
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
          eq(monzoCategories.userId, session.user.id),
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

    const category = await db
      .update(monzoCategories)
      .set({ name })
      .where(
        and(
          eq(monzoCategories.id, params.id),
          eq(monzoCategories.userId, session.user.id)
        )
      )
      .returning();

    if (!category.length) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category[0]);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await db
      .delete(monzoCategories)
      .where(
        and(
          eq(monzoCategories.id, params.id),
          eq(monzoCategories.userId, session.user.id)
        )
      )
      .returning();

    if (!category.length) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
