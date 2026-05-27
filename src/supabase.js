// ─── supabase.js ─────────────────────────────────────────────────────────────
// Place this file in cos-project/src/supabase.js
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Anonymous user ID ─────────────────────────────────────────────────────────
// Each device gets a stable ID stored in localStorage.
// When you add Clerk login later, replace this with the Clerk user ID.
function getUserId() {
  let id = localStorage.getItem("cos_user_id");
  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem("cos_user_id", id);
  }
  return id;
}

// ── db: cloud storage helper ──────────────────────────────────────────────────
export const db = {
  get: async (key, fallback) => {
    try {
      const userId = getUserId();
      const { data, error } = await supabase
        .from("cos_data")
        .select("data_value")
        .eq("user_id", userId)
        .eq("data_key", key)
        .maybeSingle();

      if (error) throw error;
      if (data) return data.data_value;

      // Nothing in cloud yet — check localStorage as migration path
      const local = localStorage.getItem(key);
      if (local) {
        const parsed = JSON.parse(local);
        await db.set(key, parsed); // migrate to cloud
        return parsed;
      }

      return fallback;
    } catch (err) {
      console.warn(`db.get(${key}) error, using localStorage:`, err.message);
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    }
  },

  set: async (key, value) => {
    try {
      const userId = getUserId();
      const { error } = await supabase
        .from("cos_data")
        .upsert(
          { user_id: userId, data_key: key, data_value: value },
          { onConflict: "user_id,data_key" }
        );
      if (error) throw error;
    } catch (err) {
      console.warn(`db.set(${key}) error, saving to localStorage:`, err.message);
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  },

  clearAll: async () => {
    try {
      const userId = getUserId();
      await supabase.from("cos_data").delete().eq("user_id", userId);
      Object.keys(localStorage).filter(k => k.startsWith("cos_")).forEach(k => localStorage.removeItem(k));
    } catch (err) {
      console.warn("db.clearAll error:", err.message);
    }
  },
};
