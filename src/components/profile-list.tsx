"use client";

import React from "react";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ProfileList() {
  const [usernames] = api.user.getUsernames.useSuspenseQuery();
  return (
    <>
      {usernames.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No profiles created yet!
        </p>
      ) : (
        <ul className="flex flex-wrap items-center gap-0.5">
          {usernames.map((username, index) => (
            <React.Fragment key={username}>
              <li>
                <Button variant="link" asChild>
                  <Link href={`/${username}`}>{username}</Link>
                </Button>
              </li>
              {index !== usernames.length - 1 && <li>&bull;</li>}
            </React.Fragment>
          ))}
        </ul>
      )}
    </>
  );
}
