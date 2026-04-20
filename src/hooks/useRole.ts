import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "student" | "teacher";

export function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      if (data && data.length > 0) {
        // teacher takes precedence if user has both
        const roles = (data as any[]).map((r) => r.role as AppRole);
        setRole(roles.includes("teacher") ? "teacher" : "student");
      } else {
        setRole("student"); // default fallback
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { role, loading };
}
