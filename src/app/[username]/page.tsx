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

  let user: z.infer<typeof UserSchema> | null = null;
  try {
    user = await api.user.getUserByUsername({ username });
  } catch (error) {
    console.log("❌ Error in profile page: ", error);
    if (error instanceof TRPCError && error.code === "BAD_REQUEST") {
      return notFound();
    }

    return (
      <div className="text-destructive text-center">
        Failed to fetch the user. Please try again
      </div>
    );
  }

  return (
    <HydrateClient>
      <main>
        <Container className="max-w-xl">
          <ProfileHeader username={username} initialData={user} />
        </Container>
      </main>
    </HydrateClient>
  );
}
