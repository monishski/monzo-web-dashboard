import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";

import { useSession } from "@/lib/auth/auth-client";

export const useGlobalEffect = (): void => {
  const { data: session, isPending } = useSession();

  const pathname = usePathname();

  useEffect(() => {
    if (!session && pathname !== "/login" && !isPending)
      redirect("/login");
    if (session && pathname === "/login") redirect("/");
  }, [session, pathname, isPending]);
};
