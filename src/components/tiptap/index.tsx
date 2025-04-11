"use client";

import "~/styles/tiptap.css";

import { EditorContent, generateHTML, useEditor } from "@tiptap/react";
import { Button } from "../ui/button";
import { List, ListOrdered, LinkIcon, X } from "lucide-react";
import { useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function RichTextEditor({
  placeholder,
  currentContent,
  onChange,
}: {
  placeholder: string;
  currentContent: string;
  onChange: (richText: string) => void;
}) {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const extensions = [
    StarterKit.configure({
      blockquote: false,
      bold: false,
      italic: false,
      code: false,
      codeBlock: false,
      heading: false,
      horizontalRule: false,
      strike: false,
    }),
    Link.configure({
      protocols: ["https", "mailto"],
    }),
    Placeholder.configure({
      placeholder,
      emptyEditorClass: "is-editor-empty",
    }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: currentContent,
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "tiptap border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-[150px] w-full rounded-b-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[1.5px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-t-none",
      },
    },
  });

  const setLink = () => {
    if (!editor) return;

    // If there's no URL, remove the link
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
      setIsLinkPopoverOpen(false);
      return;
    }

    // If there's selected text, apply link to it
    if (editor.state.selection.content().size > 0) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    // If there's no selection but linkText is provided, insert new text with link
    else if (linkText) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText}</a>`)
        .run();
    }
    // Otherwise just insert the URL as a link
    else {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
        .run();
    }

    // Reset form and close popover
    setLinkUrl("");
    setLinkText("");
    setIsLinkPopoverOpen(false);
  };

  const handleLinkButtonClick = () => {
    if (!editor) return;

    // If the selection is already a link, pre-fill the URL field
    if (editor.isActive("link")) {
      setLinkUrl(editor.getAttributes("link").href);
    }

    setIsLinkPopoverOpen(true);
  };

  if (!editor) return null;

  return (
    <>
      <div className="border-input flex items-center rounded-t-md border">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="border-input rounded-none border-r p-2 hover:cursor-pointer"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <span className="sr-only">Bullet List</span>
          <List />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          className="border-input rounded-none border-r p-2 hover:cursor-pointer"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <span className="sr-only">Ordered List</span>
          <ListOrdered />
        </Button>
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="border-input rounded-none border-r p-2 hover:cursor-pointer"
              onClick={handleLinkButtonClick}
            >
              <span className="sr-only">Add Link</span>
              <LinkIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h4 className="leading-none font-medium">Insert Link</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsLinkPopoverOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>

              <Button onClick={setLink}>Apply</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <EditorContent editor={editor} />
    </>
  );
}
