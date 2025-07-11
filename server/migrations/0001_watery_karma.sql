DO $$ BEGIN
 CREATE TYPE "public"."todo_status" AS ENUM('not_started', 'in_progress', 'done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "todo_entry" ADD COLUMN "status" "todo_status" DEFAULT 'not_started' NOT NULL;--> statement-breakpoint
ALTER TABLE "todo_entry" DROP COLUMN IF EXISTS "is_done";