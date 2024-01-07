-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "firebase_id" VARCHAR(100) NOT NULL,
    "telp" VARCHAR(20),
    "photo_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" VARCHAR(100) NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "mqtt_topic" VARCHAR(100) NOT NULL,
    "mqtt_base_url" VARCHAR(100) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" VARCHAR(100) NOT NULL,
    "user_id" VARCHAR(100) NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,

    CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id","user_id","device_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telp_key" ON "users"("telp");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "devices"("device_id");

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
