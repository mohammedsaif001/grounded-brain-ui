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
import type { Source } from "../lib/types";
import { GithubSourceForm } from "./add-source/github-source-form";
import { PdfSourceForm } from "./add-source/pdf-source-form";
import { TextSourceForm } from "./add-source/text-source-form";
import { UrlSourceForm } from "./add-source/url-source-form";

type AddSourceDialogProps = {
    workspaceId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

/**
 * Tabbed dialog for adding a source. Each tab is its own form with its own state;
 * the dialog content unmounts on close, so every opening starts clean.
 */
export function AddSourceDialog({
    workspaceId,
    open,
    onOpenChange,
}: AddSourceDialogProps) {
    const router = useRouter();

    function handleCreated(source: Source) {
        onOpenChange(false);
        router.push(routes.workspace.source(workspaceId, source.id));
    }

    const formProps = { workspaceId, onCreated: handleCreated };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add source</DialogTitle>
                    <DialogDescription>
                        Add knowledge to this workspace from text, files, or the
                        web.
                    </DialogDescription>
                </DialogHeader>

                {/* keepMounted: switching tabs must not discard what was typed. */}
                <Tabs defaultValue="text">
                    <TabsList className="w-full">
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="markdown">Markdown</TabsTrigger>
                        <TabsTrigger value="pdf">PDF</TabsTrigger>
                        <TabsTrigger value="website">Website</TabsTrigger>
                        <TabsTrigger value="youtube">YouTube</TabsTrigger>
                        <TabsTrigger value="github">GitHub</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" keepMounted>
                        <TextSourceForm kind="TEXT" {...formProps} />
                    </TabsContent>
                    <TabsContent value="markdown" keepMounted>
                        <TextSourceForm kind="MARKDOWN" {...formProps} />
                    </TabsContent>
                    <TabsContent value="pdf" keepMounted>
                        <PdfSourceForm {...formProps} />
                    </TabsContent>
                    <TabsContent value="website" keepMounted>
                        <UrlSourceForm kind="WEBSITE" {...formProps} />
                    </TabsContent>
                    <TabsContent value="youtube" keepMounted>
                        <UrlSourceForm kind="YOUTUBE" {...formProps} />
                    </TabsContent>
                    <TabsContent value="github" keepMounted>
                        <GithubSourceForm {...formProps} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
