import type { MonzoError } from "@/lib/api/types/monzo-entities";

export class MonzoApiError extends Error {
  status: number;
  error: MonzoError;

  constructor({ status, error }: { status: number; error: MonzoError }) {
    super(error.message);

    this.status = status;
    this.error = error;
  }
}
