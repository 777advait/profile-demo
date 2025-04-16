import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";
import React from "react";
import type { z } from "zod";
import Container from "~/components/container";
import ProfileHeader from "~/components/profile-header";
import { api, HydrateClient } from "~/trpc/server";
import type { UserSchema } from "~/utils/types/user.types";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  try {
    const user = await api.user.getUserByUsername({ username });
    return (
      <HydrateClient>
        <main>
          <Container className="max-w-xl">
            <ProfileHeader username={username} initialData={user} />
          </Container>
        </main>
      </HydrateClient>
    );
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return notFound();
    }

    if (error instanceof Error)
      return <div>Error loading user: {error.message}</div>;

    return <div>Error loading user</div>;
  }
}
