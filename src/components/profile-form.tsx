"use client";

import React from "react";
import * as FormComponent from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { UserSchema } from "~/utils/types/user.types";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";
import { Button, ButtonLoading } from "./ui/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

export function ProfileForm() {
  const form = useForm<z.infer<typeof UserSchema>>({
    defaultValues: {
      name: "",
      username: "",
    },
    resolver: zodResolver(UserSchema),
  });

  const utils = api.useUtils();
  const { mutateAsync: addUser } = api.user.addUser.useMutation({
    onMutate: async (newUser) => {
      await utils.user.getUsernames.cancel();
      const prevUsernames = utils.user.getUsernames.getData();

      utils.user.getUsernames.setData(undefined, (old) => [
        newUser.username,
        ...(old || []),
      ]);

      return { prevUsernames };
    },

    onSuccess: async () => {
      utils.user.getUsernames.invalidate();
      form.reset();
      toast("Successfully created user!");
    },

    onError: ({ message: description, data: error }, _newUser, context) => {
      if (context?.prevUsernames) {
        utils.user.getUsernames.setData(undefined, context.prevUsernames);
      }
      if (description === "Username is already taken") {
        form.setError("username", {
          message: "Username is already taken",
          type: "validate",
        });
        return;
      }

      toast.error("Error creating user", {
        description,
      });
    },

    onSettled: () => {
      utils.user.getUsernames.invalidate();
    },
  });

  async function onSubmit(data: z.infer<typeof UserSchema>) {
    await addUser(data);
  }

  return (
    <FormComponent.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormComponent.FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>Username</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder="Your unique @handle"
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <FormComponent.FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>Name</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder="How you'd like to be called"
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <FormComponent.FormField
          name="bio"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>What do you do?</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder="Artist, writer, musician, etc."
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <FormComponent.FormField
          name="location"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>Location</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder="Where you're based"
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <FormComponent.FormField
          name="pronouns"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>Pronouns</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder="they/them etc."
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <FormComponent.FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>Website</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Input
                    autoComplete="off"
                    {...field}
                    placeholder="https://astro-dev.tech"
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <FormComponent.FormField
          name="about"
          control={form.control}
          render={({ field }) => (
            <FormComponent.FormItem className="w-full">
              <FormComponent.FormLabel>About</FormComponent.FormLabel>
              <FormComponent.FormControl>
                <div className="w-full rounded-2xl">
                  <Textarea
                    autoComplete="off"
                    {...field}
                    placeholder="A short bio..."
                  />
                </div>
              </FormComponent.FormControl>
              <FormComponent.FormMessage />
            </FormComponent.FormItem>
          )}
        />
        <div className="flex justify-end">
          {form.formState.isSubmitting ? (
            <ButtonLoading>Creating...</ButtonLoading>
          ) : (
            <Button>
              Create Profile
              <span>
                <ArrowRight />
              </span>
            </Button>
          )}
        </div>
      </form>
    </FormComponent.Form>
  );
}
