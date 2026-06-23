import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-xl shadow-black/5">
        <p className="text-sm font-semibold text-primary">Aradea Atfal Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Welcome back.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Masuk untuk mengelola project dan career timeline.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
