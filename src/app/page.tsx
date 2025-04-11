import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import Container from "~/components/container";
import { ProfileForm } from "~/components/profile-form";
import ProfileList from "~/components/profile-list";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  void api.user.getUsernames.prefetch();

  return (
    <HydrateClient>
      <main>
        <Container>
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold">All Profiles:</h1>
              <ErrorBoundary
                fallback={
                  <p className="text-muted-foreground text-sm">
                    Error loading profiles
                  </p>
                }
              >
                <React.Suspense
                  fallback={
                    <p className="text-muted-foreground text-sm">
                      Loading profiles...
                    </p>
                  }
                >
                  <ProfileList />
                </React.Suspense>
              </ErrorBoundary>
            </div>
            <div>
              <ProfileForm />
            </div>
          </div>
        </Container>
      </main>
    </HydrateClient>
  );
}
