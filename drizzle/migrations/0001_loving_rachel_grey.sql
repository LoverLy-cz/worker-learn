CREATE TABLE `materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`cover` text NOT NULL,
	`desc` text,
	`downloads` integer DEFAULT 0
);
