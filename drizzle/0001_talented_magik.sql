PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`bio` text,
	`location` text,
	`pronouns` text,
	`website` text,
	`about` text
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "username", "bio", "location", "pronouns", "website", "about") SELECT "id", "name", "username", "bio", "location", "pronouns", "website", "about" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `username_idx` ON `user` (`username`);