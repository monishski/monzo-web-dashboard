import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db } from "@/lib/db";
import { monzoCategories } from "@/lib/db/schema/monzo-schema";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await db
      .select()
      .from(monzoCategories)
      .where(eq(monzoCategories.userId, session.user.id));

    return NextResponse.json({ categories });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
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

    const userId = session?.user?.id;

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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
