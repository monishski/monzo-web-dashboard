"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

import type { Category, Transaction } from "@/lib/types";

const TransactionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<string>("single");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const tRes = await fetch(`/api/transactions/${id}`);
        if (!tRes.ok) throw new Error(await tRes.text());
        const { data: t } = await tRes.json();
        setTransaction(t);
        setSelectedCategory(t.category?.id || "");
        const cRes = await fetch(`/api/categories`);
        if (!cRes.ok) throw new Error(await cRes.text());
        const { data: c } = await cRes.json();
        setCategories(c);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpdate = async (): Promise<void> => {
    setSubmitting(true);
    setSubmitError("");
    try {
      if (selectedScope === "single") {
        // PUT /api/transactions/:id
        const res = await fetch(`/api/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: selectedCategory }),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        // POST /api/transactions/bulk
        const scopeMap: Record<string, string> = {
          all: "all",
          past: "past",
          future: "future",
        };
        const res = await fetch(`/api/transactions/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: id,
            categoryId: selectedCategory,
            scope: scopeMap[selectedScope],
          }),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      window.location.href = `/transactions/${id}`;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setSubmitError(e.message);
      } else {
        setSubmitError("An unknown error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
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
                    value="all"
                    checked={selectedScope === "all"}
                    onChange={() => setSelectedScope("all")}
                  />
                  All related transactions (past & future)
                </label>
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="scope"
                    value="past"
                    checked={selectedScope === "past"}
                    onChange={() => setSelectedScope("past")}
                  />
                  Current and all previous transactions
                </label>
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="scope"
                    value="future"
                    checked={selectedScope === "future"}
                    onChange={() => setSelectedScope("future")}
                  />
                  Current and all future transactions
                </label>
              </div>
              {submitError && (
                <div style={{ color: "red" }}>{submitError}</div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Confirm"}
                </button>
                <Dialog.Close asChild>
                  <button type="button" disabled={submitting}>
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Link href="/transactions">Back to Transactions</Link>
    </div>
  );
};

export default TransactionPage;
