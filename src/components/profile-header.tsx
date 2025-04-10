"use client";

import React from "react";
import * as AvatarComponent from "./ui/avatar";
import { api } from "~/trpc/react";
import { MoreHorizontal } from "lucide-react";

export default function ProfileHeader({ username }: { username: string }) {
  const [user] = api.user.getUserByUsername.useSuspenseQuery({ username });
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AvatarComponent.Avatar className="size-24">
            <AvatarComponent.AvatarFallback>
              {username[0]}
            </AvatarComponent.AvatarFallback>
          </AvatarComponent.Avatar>
          <div className="">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-muted-foreground text-sm">
              {user.bio && user.location
                ? `${user.bio} in ${user.location}`
                : user.bio
                  ? `${user.bio}`
                  : null}
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
          <p className="text-muted-foreground">{user.about}</p>
        </div>
      )}
    </div>
  );
}
