-- Update existing SUPER_ADMIN and MODERATOR users to ADMIN
UPDATE "users" SET "role" = 'ADMIN' WHERE "role" IN ('SUPER_ADMIN', 'MODERATOR');

-- Create new enum with only CLIENT and ADMIN
CREATE TYPE "UserRole_new" AS ENUM ('CLIENT', 'ADMIN');

-- Drop the default constraint temporarily
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- Update the users table to use the new enum
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");

-- Restore the default constraint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- Drop the old enum and rename the new one
DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";