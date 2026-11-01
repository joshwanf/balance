-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" TEXT;

-- Give existing categories colours: each user's categories take the palette
-- in order (src/theme/categoryColors.ts), so no hue repeats until 12
UPDATE "Category" AS c
SET "color" = (ARRAY['green','blue','orange','violet','teal','red','amber','indigo','pink','olive','brown','slate'])[((n.rn - 1) % 12) + 1]
FROM (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "id") AS rn
  FROM "Category"
) AS n
WHERE c."id" = n."id";
