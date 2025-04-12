"use client";

import React from "react";
import * as AvatarComponent from "./ui/avatar";
import { api } from "~/trpc/react";
import { MoreHorizontal } from "lucide-react";
import { EditorContent, generateHTML, useEditor } from "@tiptap/react";
import { extensions } from "./tiptap";

export default function ProfileHeader({ username }: { username: string }) {
  const [user] = api.user.getUserByUsername.useSuspenseQuery({ username });
  const [avatar] = api.user.getUserAvatar.useSuspenseQuery({ name: user.name });

  const editor = useEditor({
    extensions,
    content: user.about ? generateHTML(JSON.parse(user.about), extensions) : "",
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "text-muted-foreground",
      },
    },
  });

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
          <div className="">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-muted-foreground text-sm font-medium">
              {user.work && user.location
                ? `${user.work} in ${user.location}`
                : user.work
                  ? `${user.work}`
                  : null}
              {user.pronouns && `, ${user.pronouns}`}
            </p>
            {user.website && (
              <a
                className="bg-card mt-1 block w-fit rounded-full border px-2.5 py-1 text-xs font-medium"
                href={user.website}
              >
                {user.website.replace("https://", "")}
              </a>
            )}
          </div>
        </div>
        <div>
          <MoreHorizontal />
        </div>
      </div>
      {user.about && (
        <div>
          <h2 className="text-xl font-medium">About</h2>
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
