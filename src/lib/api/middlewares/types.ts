import type { NextRequest, NextResponse } from "next/server";

import type { ApiResponse } from "../types";

export type Handler<Data, Context> = (
  request: NextRequest,
  context: Context
) => Promise<NextResponse<ApiResponse<Data>>>;
