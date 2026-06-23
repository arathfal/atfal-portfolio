"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });

    if (!response.ok) {
      setError("Username atau password tidak valid.");
      setPending(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Username</span>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="disabled:op w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
