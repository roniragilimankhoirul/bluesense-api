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

    CONSTRAINT "user_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_details" (
    "id" VARCHAR(100) NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "water_source" VARCHAR(100) NOT NULL,
    "user_device_id" TEXT NOT NULL,

    CONSTRAINT "device_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" VARCHAR(100) NOT NULL,
    "ph" DOUBLE PRECISION NOT NULL,
    "tds" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_id" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_suppliers" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15),
    "instagram_url" VARCHAR(100),
    "image_url" VARCHAR(100) NOT NULL,

    CONSTRAINT "water_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_filters" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" BIGINT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "tokopedia_url" VARCHAR(100),
    "shoppe_url" VARCHAR(100),
    "image_url" VARCHAR(100) NOT NULL,

    CONSTRAINT "water_filters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telp_key" ON "users"("telp");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "devices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_devices_id_key" ON "user_devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "device_details_user_device_id_key" ON "device_details"("user_device_id");

-- CreateIndex
CREATE UNIQUE INDEX "water_suppliers_phone_key" ON "water_suppliers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "water_suppliers_instagram_url_key" ON "water_suppliers"("instagram_url");

-- CreateIndex
CREATE UNIQUE INDEX "water_filters_tokopedia_url_key" ON "water_filters"("tokopedia_url");

-- CreateIndex
CREATE UNIQUE INDEX "water_filters_shoppe_url_key" ON "water_filters"("shoppe_url");

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_devices" ADD CONSTRAINT "user_devices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_details" ADD CONSTRAINT "device_details_user_device_id_fkey" FOREIGN KEY ("user_device_id") REFERENCES "user_devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
