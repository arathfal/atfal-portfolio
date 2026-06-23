import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { Feedback } from "./types";

export function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  return (
    <div
      role={feedback.type === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
        feedback.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      }`}
    >
      {feedback.type === "success" ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{feedback.text}</span>
    </div>
  );
}
