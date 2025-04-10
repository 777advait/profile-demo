import React from "react";
import Container from "~/components/container";
import ProfileHeader from "~/components/profile-header";
import { api, HydrateClient } from "~/trpc/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  void api.user.getUserByUsername.prefetch({ username });

  return (
    <HydrateClient>
      <main>
        <Container className="max-w-xl">
          <ProfileHeader username={username} />
        </Container>
      </main>
    </HydrateClient>
  );
}
