"use client";

import React, { useEffect, useState } from "react";
import * as AvatarComponent from "./ui/avatar";
import { api } from "~/trpc/react";
import { MoreHorizontal } from "lucide-react";
import { notFound } from "next/navigation";
import type { z } from "zod";
import type { UserSchema } from "~/utils/types/user.types";
import {
  EditorContent,
  generateHTML,
  useEditor,
  type JSONContent,
} from "@tiptap/react";
import { extensions } from "./tiptap";
import { Skeleton } from "./ui/skeleton";

export default function ProfileHeader({
  username,
  initialData,
}: {
  username: string;
  initialData?: z.infer<typeof UserSchema>;
}) {
  const { data: user, isLoading: isUserLoading } =
    api.user.getUserByUsername.useQuery({ username }, { initialData });

  const { data: avatar } = api.user.getUserAvatar.useQuery(
    { name: user?.name ?? "" },
    { enabled: !!user?.name },
  );

  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (user?.about) {
      try {
        const html = generateHTML(user.about as JSONContent, extensions);
        setContent(html);
      } catch (error) {
        console.error("Error generating HTML:", error);
        setContent("");
      }
    }
  }, [user?.about]);

  if ((!isUserLoading && !user) || !user) {
    return notFound();
  }

  const editor = useEditor(
    {
      extensions,
      content,
      editable: false,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "text-muted-foreground",
        },
      },
    },
    [content],
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AvatarComponent.Avatar className="border-ring size-24 border">
            <AvatarComponent.AvatarImage src={avatar} alt={user.username} />
            <AvatarComponent.AvatarFallback>
              {username[0]}
            </AvatarComponent.AvatarFallback>
          </AvatarComponent.Avatar>
          <div>
            {isUserLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">{user?.name}</h1>
                {(user?.work || user?.location || user?.pronouns) && (
                  <p className="text-muted-foreground text-sm font-medium">
                    {user.work && user.location
                      ? `${user.work} in ${user.location}`
                      : user.work
                        ? user.work
                        : null}
                    {(user.work || user.location) && user.pronouns
                      ? `, ${user.pronouns}`
                      : (user.pronouns ?? "")}
                  </p>
                )}
                {user?.website && (
                  <a
                    className="bg-card mt-1 block w-fit rounded-full border px-2.5 py-1 text-xs font-medium"
                    href={user.website}
                  >
                    {user.website.replace("https://", "")}
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        <MoreHorizontal />
      </div>
      {/* About section with its own loading state */}
      {isUserLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : user && user.about ? (
        <div>
          <h2 className="text-xl font-medium">About</h2>
          <EditorContent editor={editor} />
        </div>
      ) : null}
    </div>
  );
}
