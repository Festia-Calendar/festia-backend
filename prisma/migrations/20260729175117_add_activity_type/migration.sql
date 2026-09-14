-- CreateTable
CREATE TABLE `banners` (
    `bn_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bn_image` VARCHAR(256) NOT NULL,

    PRIMARY KEY (`bn_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_files` (
    `pf_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pf_activity_id` INTEGER NOT NULL,
    `pf_image` VARCHAR(256) NOT NULL,
    `pf_type` ENUM('COVER', 'GALLERY', 'VIDEO', 'LOGO') NOT NULL,

    INDEX `activity_files_pf_activity_id_idx`(`pf_activity_id`),
    PRIMARY KEY (`pf_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityScheduleFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `filePath` VARCHAR(256) NOT NULL,
    `type` ENUM('COVER', 'GALLERY', 'VIDEO', 'LOGO') NOT NULL,

    INDEX `ActivityScheduleFile_scheduleId_idx`(`scheduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `us_id` INTEGER NOT NULL AUTO_INCREMENT,
    `us_role_id` INTEGER NOT NULL,
    `us_username` VARCHAR(50) NOT NULL,
    `us_email` VARCHAR(65) NOT NULL,
    `us_password` VARCHAR(255) NOT NULL,
    `us_fname` VARCHAR(100) NOT NULL,
    `us_lname` VARCHAR(100) NOT NULL,
    `us_phone` VARCHAR(10) NOT NULL,
    `us_gender` ENUM('FEMALE', 'MALE', 'NONE') NULL,
    `us_status` ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    `us_is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `us_delete_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_us_username_key`(`us_username`),
    UNIQUE INDEX `users_us_email_key`(`us_email`),
    UNIQUE INDEX `users_us_phone_key`(`us_phone`),
    INDEX `users_us_role_id_idx`(`us_role_id`),
    PRIMARY KEY (`us_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `re_id` INTEGER NOT NULL AUTO_INCREMENT,
    `re_name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `roles_re_name_key`(`re_name`),
    PRIMARY KEY (`re_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activities` (
    `pk_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pk_location_id` INTEGER NULL,
    `pk_create_by` INTEGER NOT NULL,
    `pk_name` VARCHAR(100) NULL,
    `pk_tagline` VARCHAR(500) NULL,
    `pk_description` VARCHAR(500) NULL,
    `pk_activity_type` ENUM('CULTURAL_FESTIVAL', 'EXHIBITION_ART', 'PERFORMANCE_MUSIC', 'FOOD_DRINK_FESTIVAL', 'MARKET_FAIR', 'TRAINING_SEMINAR', 'SPORT_RECREATION', 'COMMUNITY_TOURISM') NULL,
    `pk_phone` VARCHAR(20) NULL,
    `pk_line_url` VARCHAR(255) NULL,
    `pk_facebook_url` VARCHAR(255) NULL,
    `pk_price` DECIMAL(10, 2) NULL,
    `pk_status_activity` ENUM('PUBLISH', 'UNPUBLISH', 'DRAFT') NOT NULL,
    `pk_status_approve` ENUM('PENDING', 'APPROVE', 'REJECTED') NULL,
    `pk_start_date` DATETIME NULL,
    `pk_due_date` DATETIME NULL,
    `pk_reject_reason` VARCHAR(100) NULL,
    `pk_created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `pk_updated_by` INTEGER NULL,
    `pk_updated_at` DATETIME(0) NOT NULL,
    `pk_is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `pk_delete_at` TIMESTAMP(0) NULL,
    `pk_view_count` INTEGER NOT NULL DEFAULT 0,

    INDEX `activities_pk_location_id_idx`(`pk_location_id`),
    INDEX `activities_pk_create_by_idx`(`pk_create_by`),
    INDEX `activities_pk_updated_by_idx`(`pk_updated_by`),
    PRIMARY KEY (`pk_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_schedules` (
    `as_id` INTEGER NOT NULL AUTO_INCREMENT,
    `as_activity_id` INTEGER NOT NULL,
    `as_title` VARCHAR(150) NULL,
    `as_description` VARCHAR(500) NULL,
    `as_start_datetime` DATETIME NOT NULL,
    `as_end_datetime` DATETIME NOT NULL,

    INDEX `activity_schedules_as_activity_id_idx`(`as_activity_id`),
    INDEX `activity_schedules_as_start_datetime_idx`(`as_start_datetime`),
    PRIMARY KEY (`as_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `lt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `lt_name` VARCHAR(150) NOT NULL,
    `lt_zone` VARCHAR(50) NOT NULL,
    `lt_province` VARCHAR(100) NOT NULL,
    `lt_district` VARCHAR(100) NOT NULL,
    `lt_sub_district` VARCHAR(100) NOT NULL,
    `lt_detail` VARCHAR(500) NULL,
    `lt_latitude` DOUBLE NOT NULL,
    `lt_longitude` DOUBLE NOT NULL,

    INDEX `locations_lt_province_idx`(`lt_province`),
    INDEX `locations_lt_zone_idx`(`lt_zone`),
    PRIMARY KEY (`lt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activity_files` ADD CONSTRAINT `activity_files_pf_activity_id_fkey` FOREIGN KEY (`pf_activity_id`) REFERENCES `activities`(`pk_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityScheduleFile` ADD CONSTRAINT `ActivityScheduleFile_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `activity_schedules`(`as_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_us_role_id_fkey` FOREIGN KEY (`us_role_id`) REFERENCES `roles`(`re_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_pk_location_id_fkey` FOREIGN KEY (`pk_location_id`) REFERENCES `locations`(`lt_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_pk_create_by_fkey` FOREIGN KEY (`pk_create_by`) REFERENCES `users`(`us_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_pk_updated_by_fkey` FOREIGN KEY (`pk_updated_by`) REFERENCES `users`(`us_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_schedules` ADD CONSTRAINT `activity_schedules_as_activity_id_fkey` FOREIGN KEY (`as_activity_id`) REFERENCES `activities`(`pk_id`) ON DELETE CASCADE ON UPDATE CASCADE;
