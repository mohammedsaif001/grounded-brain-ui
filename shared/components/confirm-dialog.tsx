"use client";

import { Trash2Icon, XIcon, type LucideIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

const TONES = {
  destructive: {
    variant: "destructive",
    media: "bg-tint-rose text-tint-rose-foreground",
  },
  warning: {
    variant: "warning",
    media: "bg-tint-amber text-tint-amber-foreground",
  },
} as const;

type ConfirmDialogProps = {
  /** `destructive` (rose) for deletions, `warning` (amber) for reversible-but-lossy actions. */
  tone?: keyof typeof TONES;
  /** Icon in the header badge and on the confirm button. Defaults to a bin. */
  icon?: LucideIcon;
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Confirmation for destructive actions. Keeps focus management in the primitive. */
export function ConfirmDialog({
  open,
  title,
  description,
  tone = "destructive",
  icon: Icon = Trash2Icon,
  confirmLabel = "Delete",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={`size-12 rounded-2xl *:[svg:not([class*='size-'])]:size-6 ${TONES[tone].media}`}
          >
            <Icon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            <XIcon aria-hidden="true" />
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={TONES[tone].variant}
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isPending ? <Spinner /> : <Icon aria-hidden="true" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
