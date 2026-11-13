-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'SONNET_HIGH', 'SONNET_XHIGH', 'OPUS_MEDIUM', 'OPUS_HIGH', 'OPUS_XHIGH');

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "user_id" UUID NOT NULL,
    "current_period_end" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
