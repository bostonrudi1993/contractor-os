// ─── supabase.js ─────────────────────────────────────────────────────────────
// Cloud storage helper — data is scoped by Clerk organization ID so each
// company only ever sees their own data. Falls back to localStorage on error.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// ── Org/User ID resolution ────────────────────────────────────────────────────
// Called with the Clerk org ID when available, falls back to anonymous device ID.
// Data key structure: org data uses org_id, personal prefs use user_id.
export function getOrgId(clerkOrgId) {
  if (clerkOrgId) return clerkOrgId;
  // Anonymous fallback — stable per device
  let id = localStorage.getItem("cos_user_id");
  if (!id) {
    id = "anon_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("cos_user_id", id);
  }
  return id;
}

// ── db factory — call with Clerk org ID ──────────────────────────────────────
// Usage:
//   const { orgId } = useOrganization();
//   const storage = makeDb(orgId);
//   const drivers = await storage.get("cos_drivers", []);
//   await storage.set("cos_drivers", updatedDrivers);

export function makeDb(clerkOrgId) {
  const scopeId = getOrgId(clerkOrgId);

  return {
    scopeId,

    get: async (key, fallback) => {
      if (!supabase) {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
      }
      try {
        const { data, error } = await supabase
          .from("cos_data")
          .select("data_value")
          .eq("user_id", scopeId)
          .eq("data_key", key)
          .maybeSingle();

        if (error) throw error;
        if (data) return data.data_value;

        // Migrate from localStorage on first cloud access
        const local = localStorage.getItem(key);
        if (local) {
          const parsed = JSON.parse(local);
          supabase.from("cos_data").upsert(
            { user_id: scopeId, data_key: key, data_value: parsed },
            { onConflict: "user_id,data_key" }
          ).then(() => {});
          return parsed;
        }
        return fallback;
      } catch (err) {
        console.warn(`db.get(${key}):`, err.message);
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
      }
    },

    set: async (key, value) => {
      if (!supabase) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
        return;
      }
      try {
        const { error } = await supabase
          .from("cos_data")
          .upsert(
            { user_id: scopeId, data_key: key, data_value: value },
            { onConflict: "user_id,data_key" }
          );
        if (error) throw error;
      } catch (err) {
        console.warn(`db.set(${key}):`, err.message);
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
      }
    },

    clearAll: async () => {
      if (supabase) {
        try {
          await supabase.from("cos_data").delete().eq("user_id", scopeId);
        } catch (err) {
          console.warn("db.clearAll:", err.message);
        }
      }
      Object.keys(localStorage).filter(k => k.startsWith("cos_")).forEach(k => localStorage.removeItem(k));
    },
  };
}

// ── Legacy db export (used before Clerk loads) ───────────────────────────────
// This is used during initial load before we know the org ID.
// Once Clerk loads, the app switches to makeDb(orgId).
export const db = makeDb(null);
