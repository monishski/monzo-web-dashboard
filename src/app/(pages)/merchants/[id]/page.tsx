"use client";

import { useState, type JSX } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useGetCategories } from "@/api/queries/categories";
import {
  useGetMerchantGroup,
  useUpdateMerchantGroup,
} from "@/api/queries/merchants";

function MerchantPage(): JSX.Element {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: merchantGroup, isLoading: isMerchantsLoading } =
    useGetMerchantGroup(id);
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const { mutate: updateMerchant, isPending: isMerchantUpdating } =
    useUpdateMerchantGroup({
      onSuccess: () => {
        router.push(`/merchants/${id}`);
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    updateMerchant({ id, categoryId: selectedCategory });
  };

  if (isMerchantsLoading || isCategoriesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <pre>{JSON.stringify(merchantGroup, null, 2)}</pre>
      <h1>Edit Merchant Group Category</h1>
      <form>
        <div>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={merchantGroup?.category?.id || ""}
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isMerchantUpdating}
        >
          {isMerchantUpdating ? "Updating..." : "Update"}
        </button>
      </form>
      <Link href={`/transactions?merchantGroupIds=${id}`}>
        Transactions
      </Link>
    </div>
  );
}

export default MerchantPage;
