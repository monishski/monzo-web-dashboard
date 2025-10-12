"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

import { BulkUpdateTransactionScope } from "@/lib/api/types/response";
import { useGetCategories } from "@/api/queries/categories";
import {
  useBulkUpdateTransactions,
  useGetTransaction,
  useUpdateTransaction,
} from "@/api/queries/transactions";
import { getTransactionsUrl, getTransactionUrl } from "@/routing";

const TransactionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<
    "single" | BulkUpdateTransactionScope
  >("single");

  const {
    data: transaction,
    isLoading: loading,
    error,
  } = useGetTransaction(id);
  const { data: categories = [] } = useGetCategories();
  const {
    mutate: updateTransaction,
    isPending: isUpdatingTransaction,
    error: updateTransactionError,
  } = useUpdateTransaction({
    onSuccess: () => {
      redirect(getTransactionUrl(id));
    },
  });
  const {
    mutate: bulkUpdateTransactions,
    isPending: isBulkUpdatingTransactions,
    error: bulkUpdateTransactionError,
  } = useBulkUpdateTransactions({
    onSuccess: () => {
      redirect(getTransactionUrl(id));
    },
  });

  useEffect(() => {
    if (transaction?.category?.id) {
      setSelectedCategory(transaction.category.id);
    }
  }, [transaction]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error.message}</div>;
  if (!transaction) return <div>Transaction not found</div>;

  return (
    <div>
      <pre>{JSON.stringify(transaction, null, 2)}</pre>
      <h1>Edit Transaction Category</h1>
      <div>
        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          required
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Trigger asChild>
          <button type="button">Update</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              background: "rgba(0,0,0,0.3)",
              position: "fixed",
              inset: 0,
              zIndex: 1000,
            }}
          />
          <Dialog.Content
            style={{
              background: "white",
              borderRadius: 8,
              padding: 24,
              minWidth: 400,
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
            }}
          >
            <Dialog.Title>How should this update be applied?</Dialog.Title>
            <form>
              <div style={{ margin: "16px 0" }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="scope"
                    value="single"
                    checked={selectedScope === "single"}
                    onChange={() => setSelectedScope("single")}
                  />
                  Just this transaction
                </label>
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="scope"
                    value={BulkUpdateTransactionScope.ALL}
                    checked={
                      selectedScope === BulkUpdateTransactionScope.ALL
                    }
                    onChange={() =>
                      setSelectedScope(BulkUpdateTransactionScope.ALL)
                    }
                  />
                  All related transactions (past & future)
                </label>
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="scope"
                    value={BulkUpdateTransactionScope.PAST}
                    checked={
                      selectedScope === BulkUpdateTransactionScope.PAST
                    }
                    onChange={() =>
                      setSelectedScope(BulkUpdateTransactionScope.PAST)
                    }
                  />
                  Current and all previous transactions
                </label>
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="scope"
                    value={BulkUpdateTransactionScope.FUTURE}
                    checked={
                      selectedScope === BulkUpdateTransactionScope.FUTURE
                    }
                    onChange={() =>
                      setSelectedScope(BulkUpdateTransactionScope.FUTURE)
                    }
                  />
                  Current and all future transactions
                </label>
              </div>
              {(updateTransactionError || bulkUpdateTransactionError) && (
                <div style={{ color: "red" }}>
                  {updateTransactionError?.message ||
                    bulkUpdateTransactionError?.message}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  type="submit"
                  disabled={
                    isUpdatingTransaction || isBulkUpdatingTransactions
                  }
                  onClick={(e) => {
                    e.preventDefault();

                    if (selectedScope === "single") {
                      updateTransaction({
                        id,
                        categoryId: selectedCategory,
                      });
                    } else {
                      bulkUpdateTransactions({
                        transactionId: id,
                        categoryId: selectedCategory,
                        scope: selectedScope,
                      });
                    }
                  }}
                >
                  {isUpdatingTransaction || isBulkUpdatingTransactions
                    ? "Updating..."
                    : "Confirm"}
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    disabled={
                      isUpdatingTransaction || isBulkUpdatingTransactions
                    }
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Link href={getTransactionsUrl()}>Back to Transactions</Link>
    </div>
  );
};

export default TransactionPage;
