import { cn } from "@/lib/utils";
import { toneClasses, type Tone } from "./tint";

type CalloutProps = {
  title?: React.ReactNode;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
};

/** Tinted inline note, e.g. "Try it in your next study session". */
export function Callout({
  title,
  tone = "green",
  className,
  children,
}: CalloutProps) {
  return (
    <aside
      className={cn("space-y-1 rounded-xl px-4 py-3", toneClasses[tone], className)}
    >
      {title ? (
        <p className="text-eyebrow text-current opacity-80">{title}</p>
      ) : null}
      <div className="text-body">{children}</div>
    </aside>
  );
}
