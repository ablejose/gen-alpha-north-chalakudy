"use client";

import { type FormEvent, useEffect, useState } from "react";
import { COLLECTIONS } from "@/config/collections";
import { CollectionUploader } from "@/components/admin/CollectionUploader";

// The password gate runs entirely in the browser, so this password is NOT a
// real security boundary (anyone can read it in the page source). It keeps
// casual visitors out; do not put anything sensitive behind it. Override via
// NEXT_PUBLIC_ADMIN_PASSWORD if you want to change it without editing code.
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "genalpha@2026";
const STORAGE_KEY = "ga-admin-authed";

/**
 * Password-gated admin panel. Once unlocked, shows one image manager per
 * collection so the admin can upload images to each collection page without
 * touching code. Auth state lives in sessionStorage (cleared when the tab
 * closes).
 */
export function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    }
    setChecked(true);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  };

  const signOut = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPassword("");
  };

  // Avoid a flash of the login form before sessionStorage is read.
  if (!checked) return null;

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={submit} className="w-full max-w-sm rounded-card border border-border p-8">
          <h1 className="font-display text-display-m text-ivory">Admin</h1>
          <p className="mt-2 font-sans text-body text-muted">
            Enter the password to manage collection images.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="mt-6 min-h-[48px] w-full rounded-pill border border-gold/40 bg-background px-5 font-sans text-body text-ivory outline-none transition-colors focus:border-gold"
          />
          {error ? <p className="mt-3 font-sans text-body text-[#e88]">{error}</p> : null}
          <button type="submit" className="btn-primary mt-6 w-full">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-lux py-16 md:py-24">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <span className="label-eyebrow">Admin</span>
          <h1 className="mt-3 font-display text-display-l text-ivory">Manage Collections</h1>
          <p className="mt-2 max-w-xl font-sans text-body text-muted">
            Upload images for each collection. Changes appear on the live site within about a minute.
          </p>
        </div>
        <button type="button" onClick={signOut} className="btn-secondary">
          Sign out
        </button>
      </header>

      <div className="mt-10 flex flex-col gap-8">
        {COLLECTIONS.map((collection) => (
          <CollectionUploader key={collection.slug} collection={collection} />
        ))}
      </div>
    </div>
  );
}
