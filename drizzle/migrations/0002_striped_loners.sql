PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_materials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`cover` text NOT NULL,
	`desc` text,
	`downloads` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_materials`("id", "title", "cover", "desc", "downloads") SELECT "id", "title", "cover", "desc", "downloads" FROM `materials`;--> statement-breakpoint
DROP TABLE `materials`;--> statement-breakpoint
ALTER TABLE `__new_materials` RENAME TO `materials`;--> statement-breakpoint
PRAGMA foreign_keys=ON;