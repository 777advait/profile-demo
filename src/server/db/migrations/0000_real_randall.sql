CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`bio` text NOT NULL,
	`location` text NOT NULL,
	`pronouns` text NOT NULL,
	`website` text NOT NULL,
	`about` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `username_idx` ON `user` (`username`);