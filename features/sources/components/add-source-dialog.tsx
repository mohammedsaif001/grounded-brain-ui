"use client";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/shared/config/routes";
import { SOURCE_TYPE_LABELS } from "../lib/constants";
import type { Source, SourceType } from "../lib/types";
import { SourceFormProvider } from "./add-source/form-fields";
import { GithubSourceForm } from "./add-source/github-source-form";
import { PdfSourceForm } from "./add-source/pdf-source-form";
import { TextSourceForm } from "./add-source/text-source-form";
import { UrlSourceForm } from "./add-source/url-source-form";
import { SOURCE_TYPE_ICONS } from "./source-type-icon";

type AddSourceDialogProps = {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Shown in the subtitle; falls back to a generic phrase when omitted. */
    workspaceTitle?: string;
};

/** Tab order follows the design: file first, then links, then pasted content. */
const TAB_ORDER: readonly SourceType[] = [
    "PDF",
    "WEBSITE",
    "YOUTUBE",
    "GITHUB",
    "TEXT",
    "MARKDOWN",
];

/**
 * Tabbed dialog for adding a source. Each tab is its own form with its own state;
 * the dialog content unmounts on close, so every opening starts clean.
 */
export function AddSourceDialog({
    workspaceId,
    open,
    onOpenChange,
    workspaceTitle,
}: AddSourceDialogProps) {
    const router = useRouter();

    function handleCreated(source: Source) {
        onOpenChange(false);
        router.push(routes.workspace.source(workspaceId, source.id));
    }

    const formProps = { workspaceId, onCreated: handleCreated };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto short:gap-4 short:p-5 sm:max-w-2xl">
                <DialogHeader className="gap-2 pr-10">
                    <DialogTitle className="text-title">
                        Give your ideas a starting point.
                    </DialogTitle>
                    <DialogDescription className="text-body">
                        Add a source to{" "}
                        {workspaceTitle ? workspaceTitle : "this notebook"}.
                    </DialogDescription>
                </DialogHeader>

                <SourceFormProvider value={{ onCancel: () => onOpenChange(false) }}>
                    {/* keepMounted: switching tabs must not discard what was typed. */}
                    <Tabs defaultValue="PDF">
                        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 p-1 group-data-horizontal/tabs:h-auto sm:grid-cols-6">
                            {TAB_ORDER.map((type) => {
                                const Icon = SOURCE_TYPE_ICONS[type];
                                return (
                                    <TabsTrigger
                                        key={type}
                                        value={type}
                                        className="h-auto flex-col gap-1.5 px-2 py-3 text-xs short:py-2"
                                    >
                                        <Icon aria-hidden="true" className="size-5" />
                                        {SOURCE_TYPE_LABELS[type]}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        <TabsContent value="PDF" keepMounted>
                            <PdfSourceForm {...formProps} />
                        </TabsContent>
                        <TabsContent value="WEBSITE" keepMounted>
                            <UrlSourceForm kind="WEBSITE" {...formProps} />
                        </TabsContent>
                        <TabsContent value="YOUTUBE" keepMounted>
                            <UrlSourceForm kind="YOUTUBE" {...formProps} />
                        </TabsContent>
                        <TabsContent value="GITHUB" keepMounted>
                            <GithubSourceForm {...formProps} />
                        </TabsContent>
                        <TabsContent value="TEXT" keepMounted>
                            <TextSourceForm kind="TEXT" {...formProps} />
                        </TabsContent>
                        <TabsContent value="MARKDOWN" keepMounted>
                            <TextSourceForm kind="MARKDOWN" {...formProps} />
                        </TabsContent>
                    </Tabs>
                </SourceFormProvider>
            </DialogContent>
        </Dialog>
    );
}
