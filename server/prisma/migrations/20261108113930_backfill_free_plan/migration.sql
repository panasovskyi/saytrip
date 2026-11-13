INSERT INTO "subscriptions" ("id", "user_id", "updated_at")
SELECT gen_random_uuid(), u."id", now()
FROM "users" u
WHERE NOT EXISTS (
  SELECT 1 FROM "subscriptions" s WHERE s."user_id" = u."id"
)