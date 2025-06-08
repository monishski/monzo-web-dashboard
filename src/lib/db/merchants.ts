import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";
import type { TransactionMerchant } from "@/types/common";

export async function upsertMerchant(merchant: TransactionMerchant): Promise<string> {
  // First try to find the merchant
  const existingMerchant = await db
    .select()
    .from(monzoMerchants)
    .where(eq(monzoMerchants.id, merchant.id))
    .limit(1);

  if (existingMerchant.length > 0) {
    return existingMerchant[0].id;
  }

  // If merchant doesn't exist, insert it
  const [insertedMerchant] = await db
    .insert(monzoMerchants)
    .values({
      id: merchant.id,
      groupId: merchant.group_id,
      name: merchant.name,
      logo: merchant.logo,
      emoji: merchant.emoji,
      category: merchant.category,
      online: merchant.online,
      atm: merchant.atm,
      address: merchant.address,
      disableFeedback: merchant.disable_feedback,
      metadata: merchant.metadata,
    })
    .returning({ id: monzoMerchants.id });

  return insertedMerchant.id;
}
