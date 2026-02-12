import { MigrationInterface, QueryRunner } from 'typeorm'

export class CoreMigration1725039306355 implements MigrationInterface {
  name = 'CoreMigration1725039306355'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "keyId" character varying NOT NULL, "label" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accessTokenHash" character varying NOT NULL, "validUntil" TIMESTAMP NOT NULL, "lastUsedAt" date, "userId" uuid, CONSTRAINT "UQ_9d2cf0a2cc3df58b87cbbc43e48" UNIQUE ("keyId"), CONSTRAINT "UQ_15b2228d06b08bb4cc98876c651" UNIQUE ("accessTokenHash"), CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "code-assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "language" character varying NOT NULL DEFAULT 'javascript', "body" json, CONSTRAINT "PK_67d5ad6bc3a8c15ef172ca789bb" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "course-author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying, "about" character varying, "linkedin" character varying, "email" character varying NOT NULL, "avatar" character varying, "courseId" uuid, CONSTRAINT "PK_db78f05b27c329683b1609cb9ff" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "course_certificates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_93a863191e8b5a8160f80ace881" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson_to_course_unit" ("courseUnitId" uuid NOT NULL, "lessonId" uuid NOT NULL, "sort" double precision, CONSTRAINT "PK_0bbbd9906c75d45806d942dd40b" PRIMARY KEY ("courseUnitId", "lessonId"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "head" character varying, "scripts" character varying, CONSTRAINT "PK_f348d4694945d9dc4c7049a178a" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "course-progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "progress_meta" json DEFAULT '{"step_ids":[],"body":""}', CONSTRAINT "PK_ebf387d1a8dd79ac6443eb8b2bd" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "lessons-content-validator" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "regex" character varying NOT NULL, "lessonContentId" uuid, CONSTRAINT "PK_4fd94e6c6c1866422318a371128" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons-contents_type_enum" AS ENUM('editable', 'slides', 'code')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons-contents_complexity_enum" AS ENUM('beginner', 'intermediate', 'advanced', 'expert')`,
    )
    await queryRunner.query(
      `CREATE TABLE "lessons-contents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" "public"."lessons-contents_type_enum" NOT NULL DEFAULT 'editable', "slug" character varying, "title" character varying, "description" character varying, "cover" character varying, "complexity" "public"."lessons-contents_complexity_enum" NOT NULL DEFAULT 'beginner', "body" json, "active" boolean NOT NULL DEFAULT false, "draft" boolean NOT NULL DEFAULT true, "solution_body" character varying, "preload_body" character varying, "tips" character varying, "tags" character varying array NOT NULL DEFAULT '{}', "meta" json DEFAULT '{}', "bg_color" character varying, "creatorId" uuid, "lessonId" uuid, CONSTRAINT "PK_0165cc3fc1349a63302a6fdb113" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."lessons_type_enum" AS ENUM('practical', 'exercise', 'quiz', 'open_project')`,
    )
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "draft" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "auto_graded" boolean NOT NULL DEFAULT true, "core" boolean NOT NULL DEFAULT true, "type" "public"."lessons_type_enum" DEFAULT 'practical', "description" character varying, "head" character varying, "tips" character varying array NOT NULL DEFAULT '{}', "duration" interval, "independent" boolean, "userId" uuid, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson-last-slide" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slideNumber" integer, "lessonId" uuid, "studentId" uuid, CONSTRAINT "PK_922028956041540c1621404b208" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "course_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "rating" integer, "courseId" uuid, "studentId" uuid, CONSTRAINT "PK_572d8c6598842f8b6cbde2e1aa5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "school-contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying, "name" character varying, "phone" character varying, "technical_email" character varying, "technical_name" character varying, "technical_phone" character varying, "billing_email" character varying, "billing_name" character varying, "billing_phone" character varying, CONSTRAINT "PK_058048432bc52e4736c7058df89" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "school-settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "language" character varying NOT NULL DEFAULT 'en', "marketplace_content_allowed" boolean NOT NULL DEFAULT false, "github_login_allowed" boolean NOT NULL DEFAULT false, "google_login_allowed" boolean NOT NULL DEFAULT false, "invite_only" boolean NOT NULL DEFAULT false, "last_name_only" boolean NOT NULL DEFAULT true, "chat_allowed" boolean NOT NULL DEFAULT false, "gallery_allowed" boolean NOT NULL DEFAULT false, "global_gallery_allowed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fb914a6fcc4584eadc48b6ef30d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "school-socials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" character varying NOT NULL, "name" character varying NOT NULL, "link" character varying NOT NULL, "schoolId" uuid, CONSTRAINT "PK_db50686373630ea5b44b611f22d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "code" integer NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "schoolId" uuid, CONSTRAINT "UQ_c7a1bd9c54e132e4ee4152aa51c" UNIQUE ("email"), CONSTRAINT "PK_3f53f2579164a9013ea84035a6f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."schools_type_enum" AS ENUM('Primary School', 'Middle School', 'High School', 'Technical School', 'College', 'University', 'Other')`,
    )
    await queryRunner.query(
      `CREATE TABLE "schools" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "country" character varying, "address" character varying, "phone" character varying, "city" character varying, "zip" character varying, "type" "public"."schools_type_enum", "about" character varying, "active" boolean NOT NULL DEFAULT true, "avatar" character varying, "cover" character varying, "contactId" uuid, "settingId" uuid, CONSTRAINT "REL_e6a296ef2dd907d5fdd8aee7a1" UNIQUE ("contactId"), CONSTRAINT "REL_849910d038aafddeacc1c8b8a6" UNIQUE ("settingId"), CONSTRAINT "PK_95b932e47ac129dd8e23a0db548" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-goals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "color" character varying NOT NULL, "studentId" uuid, CONSTRAINT "PK_1f61f86c91afbfe620fe3231acd" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "cover" character varying, "avatar" character varying, "language" character varying NOT NULL, "body" json, "public" boolean NOT NULL DEFAULT false, "studentId" uuid, CONSTRAINT "PK_2112a83ab0887e75e870c5eab54" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-socials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" character varying NOT NULL, "name" character varying NOT NULL, "link" character varying NOT NULL, "studentId" uuid, CONSTRAINT "PK_5c2eb848c57d466717b52de7660" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying, "first_name" character varying, "last_name" character varying, "phone" character varying, "country" character varying, "state" character varying, "city" character varying, "post_code" character varying, "cover" character varying, "about" character varying, "verified" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "avatar" character varying, "lessonId" uuid, "unitId" uuid, "courseId" uuid, "progressId" uuid, CONSTRAINT "UQ_fa8c3b4233deabc0917380ef4ef" UNIQUE ("username"), CONSTRAINT "REL_64296897de1b0efdd3a8628efe" UNIQUE ("progressId"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "course_likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "liked" boolean NOT NULL DEFAULT false, "courseId" uuid, "studentId" uuid, CONSTRAINT "PK_27a0a53d61523df9affc5e02757" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."courses_level_enum" AS ENUM('beginner', 'intermediate', 'advanced')`,
    )
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "public" boolean NOT NULL DEFAULT false, "catalog" boolean NOT NULL DEFAULT false, "userId" uuid, "draft" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "price" money NOT NULL, "content_id" character varying NOT NULL, "level" "public"."courses_level_enum" NOT NULL DEFAULT 'beginner', "description" character varying, "cover" character varying, "preview" character varying, "initial_enrolled" integer NOT NULL DEFAULT '2700', "initial_likes" integer NOT NULL DEFAULT '3200', "initial_stars" integer NOT NULL DEFAULT '8200', "certificateId" uuid, CONSTRAINT "UQ_8dc2b5ad72fcb4c4c2d366e59ec" UNIQUE ("content_id"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "course_units" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "avatar" character varying, "initial_enrolled" integer NOT NULL DEFAULT '2700', "initial_likes" integer NOT NULL DEFAULT '3200', "initial_stars" integer NOT NULL DEFAULT '8200', "description" character varying, "tips" character varying array NOT NULL DEFAULT '{}', "duration" interval, CONSTRAINT "PK_2e87ce20535110712778a829937" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."assigments_type_enum" AS ENUM('course', 'open_project', 'group_coding_project', 'review', 'exersize', 'research', 'custom_content')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."assigments_category_enum" AS ENUM('creative_project', 'research_project', 'team_project', 'other')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."assigments_status_enum" AS ENUM('open', 'ending', 'closed', 'overdue')`,
    )
    await queryRunner.query(
      `CREATE TABLE "assigments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "courseUnitId" uuid, "lessonId" uuid, "description" character varying, "type" "public"."assigments_type_enum", "category" "public"."assigments_category_enum", "language" character varying, "lessonTitle" character varying, "status" "public"."assigments_status_enum" NOT NULL DEFAULT 'open', "duration" interval, "active" boolean NOT NULL DEFAULT true, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "end_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "close_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "meta" json DEFAULT '{}', "codeAssignmentId" uuid, "creatorId" uuid, "schoolId" uuid, "courseId" uuid, CONSTRAINT "PK_0714b068663422df73b21352daa" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('owner', 'admin', 'manager', 'student', 'editor', 'anonymous')`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'manager', "password" character varying, "first_name" character varying, "avatar" character varying, "last_name" character varying, "verified" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT true, "username" character varying, "displayName" character varying, "studentProfileId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_7857f65e94524a542ecb7de8f8" UNIQUE ("studentProfileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "classes-preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "share_token_enable" boolean NOT NULL DEFAULT true, "request_join_enable" boolean NOT NULL DEFAULT true, "subscribe_enable" boolean NOT NULL DEFAULT true, "share_token" character varying, CONSTRAINT "UQ_28d23d417ba38530deb3cd858b7" UNIQUE ("share_token"), CONSTRAINT "PK_ca21625e0a27ec233e512e5ff45" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "avatar" character varying, "cover" character varying, "active" boolean NOT NULL DEFAULT true, "schoolId" uuid, "class-setting" uuid, CONSTRAINT "REL_e611e0cb5860952e085fb2da02" UNIQUE ("class-setting"), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "class-student-pending" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "studentId" uuid, "classId" uuid, CONSTRAINT "PK_a4be365e55e62bfedd3965e2591" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."medias_type_enum" AS ENUM('folder', 'image')`,
    )
    await queryRunner.query(
      `CREATE TYPE "public"."medias_acl_enum" AS ENUM('private', 'public')`,
    )
    await queryRunner.query(
      `CREATE TABLE "medias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "url" character varying NOT NULL, "type" "public"."medias_type_enum" NOT NULL DEFAULT 'image', "acl" "public"."medias_acl_enum" NOT NULL DEFAULT 'public', "size" integer, "userId" uuid, "schoolId" uuid, CONSTRAINT "PK_f27321557a66cd4fae9bc1ed6e7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "User-reset-password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_27494abb7ddc6fcdeb549e953d5" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "student-reset-password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "studentId" uuid NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_78c4234589e64811305efcf7175" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "progress_lesson_complete" ("lessonsContentsId" uuid NOT NULL, "courseProgressId" uuid NOT NULL, CONSTRAINT "PK_32acfa5ebe52a3bfce8d3e09f67" PRIMARY KEY ("lessonsContentsId", "courseProgressId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_07f40bfd0dd2b2cad07c39c424" ON "progress_lesson_complete" ("lessonsContentsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ea43eaf5f1036ec0fb1732d0eb" ON "progress_lesson_complete" ("courseProgressId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson-skills" ("skillsId" uuid NOT NULL, "lessonsId" uuid NOT NULL, CONSTRAINT "PK_b0a317e1e4480dc61d54f9aa8bb" PRIMARY KEY ("skillsId", "lessonsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f66593ba240849193c4e53dc45" ON "lesson-skills" ("skillsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d2d9b0b47eb11cf6d13572ed4b" ON "lesson-skills" ("lessonsId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "skill_assigment" ("skillsId" uuid NOT NULL, "assigmentsId" uuid NOT NULL, CONSTRAINT "PK_f06c33856e444030bac3d28aa94" PRIMARY KEY ("skillsId", "assigmentsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_032626f9d5660b5096a38e2262" ON "skill_assigment" ("skillsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_4917f07523d0d4d536594ed5ac" ON "skill_assigment" ("assigmentsId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "lessons_authors_users" ("lessonsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_7db7df96eaf1e1e05e9a53a3300" PRIMARY KEY ("lessonsId", "usersId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_aae5774620832645553906da15" ON "lessons_authors_users" ("lessonsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_9ed2137163223f971cab6dd5de" ON "lessons_authors_users" ("usersId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "lesson-integrations" ("lessonsId" uuid NOT NULL, "integrationId" uuid NOT NULL, CONSTRAINT "PK_88ba879a6793b1a026196dfe312" PRIMARY KEY ("lessonsId", "integrationId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_c82a0b4f890aee4974794cac38" ON "lesson-integrations" ("lessonsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_65c55dde9b6d8514f351a99471" ON "lesson-integrations" ("integrationId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "student_schools" ("schoolId" uuid NOT NULL, "studentId" uuid NOT NULL, CONSTRAINT "PK_3dd6a9e9849b5ac9aed76776ed8" PRIMARY KEY ("schoolId", "studentId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_940bb558bd7ea63faebcf5072d" ON "student_schools" ("schoolId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_07321a4ca48e9f8492b0b0d854" ON "student_schools" ("studentId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "users_schools" ("schoolId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b8ca1691f024dc48dc78baa6ba3" PRIMARY KEY ("schoolId", "userId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2b267c92cd09e12989940b30fd" ON "users_schools" ("schoolId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7ea92212ec5ba33043f0ecd322" ON "users_schools" ("userId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "students_pined_assignment_assigments" ("studentsId" uuid NOT NULL, "assigmentsId" uuid NOT NULL, CONSTRAINT "PK_35267f71b077395deb107e67515" PRIMARY KEY ("studentsId", "assigmentsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a7abfd65256f802ddb72a017f1" ON "students_pined_assignment_assigments" ("studentsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0646d7ecf819f42f3e9ef960fb" ON "students_pined_assignment_assigments" ("assigmentsId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "stuent_classes" ("studentsId" uuid NOT NULL, "classesId" uuid NOT NULL, CONSTRAINT "PK_571d09d8d68ec8042c995ce4bb9" PRIMARY KEY ("studentsId", "classesId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_fffd3ed59754319faa435a9604" ON "stuent_classes" ("studentsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d76397aa93f56b1c7e745d3a59" ON "stuent_classes" ("classesId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "student_assigment" ("studentsId" uuid NOT NULL, "assigmentsId" uuid NOT NULL, CONSTRAINT "PK_8dae207eaef597ccde139c17f38" PRIMARY KEY ("studentsId", "assigmentsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f7d2b188cc524701cc228f7965" ON "student_assigment" ("studentsId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b0924e08cdf1c575d884c98beb" ON "student_assigment" ("assigmentsId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "courses_schools_schools" ("coursesId" uuid NOT NULL, "schoolsId" uuid NOT NULL, CONSTRAINT "PK_a00dbab92e6f21c851424681b8b" PRIMARY KEY ("coursesId", "schoolsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6917390cd25319442d535dcab3" ON "courses_schools_schools" ("coursesId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e4c60ab36b58635a1b81d78019" ON "courses_schools_schools" ("schoolsId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "courses_classes_classes" ("coursesId" uuid NOT NULL, "classesId" uuid NOT NULL, CONSTRAINT "PK_4c080631389c860f68e8b7c8842" PRIMARY KEY ("coursesId", "classesId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8e170858cd3ab67de38e2c122b" ON "courses_classes_classes" ("coursesId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d8095732baf98ac1706d80f6ff" ON "courses_classes_classes" ("classesId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "courses_units_course_units" ("coursesId" uuid NOT NULL, "courseUnitsId" uuid NOT NULL, CONSTRAINT "PK_f139e74e66c564c242b2b63694e" PRIMARY KEY ("coursesId", "courseUnitsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d6885f90583993a79f5e1a12af" ON "courses_units_course_units" ("coursesId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_a507785849a154ef2d81c82cb6" ON "courses_units_course_units" ("courseUnitsId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "class_mentors" ("classesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_e112b50fb842d74ada1c6d17928" PRIMARY KEY ("classesId", "usersId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8e5b48ab21c821190a9f5a32c8" ON "class_mentors" ("classesId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_5ba31bded1dc7c0fd8220e2edb" ON "class_mentors" ("usersId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "class_assigment" ("classesId" uuid NOT NULL, "assigmentsId" uuid NOT NULL, CONSTRAINT "PK_d5946f531bb7d26b7abfa9ad1a6" PRIMARY KEY ("classesId", "assigmentsId"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_87f2f3e1f9500147fc982f8d5b" ON "class_assigment" ("classesId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b4532db1c66b392e9efefecc97" ON "class_assigment" ("assigmentsId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "auth_token" ADD CONSTRAINT "FK_5a326267f11b44c0d62526bc718" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "course-author" ADD CONSTRAINT "FK_ab22af6cdda162966bbd24e7e85" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson_to_course_unit" ADD CONSTRAINT "FK_bace3ead262f3491cbd6787be7d" FOREIGN KEY ("courseUnitId") REFERENCES "course_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson_to_course_unit" ADD CONSTRAINT "FK_0091dddc8f7bae9923bcd667804" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-content-validator" ADD CONSTRAINT "FK_e259cad82c237846034c45e3326" FOREIGN KEY ("lessonContentId") REFERENCES "lessons-contents"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ADD CONSTRAINT "FK_deb8a29eef376aab009eb7bffe3" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" ADD CONSTRAINT "FK_315937043256b6411035bd3d723" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "FK_d858621aa37f9325bb186c9bc87" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-last-slide" ADD CONSTRAINT "FK_15cbc96b984b5d53a1cd72f13a2" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-last-slide" ADD CONSTRAINT "FK_5536b98cc321a13ace98abe47c1" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_rating" ADD CONSTRAINT "FK_a3d4d5506ab43943558e8618206" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_rating" ADD CONSTRAINT "FK_7e2c4436f6257f147eb56469fc8" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "school-socials" ADD CONSTRAINT "FK_d6b9de006beeab3d21456126b5e" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-invitations" ADD CONSTRAINT "FK_67e55a0785d4a06507c89d0ce72" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "schools" ADD CONSTRAINT "FK_e6a296ef2dd907d5fdd8aee7a16" FOREIGN KEY ("contactId") REFERENCES "school-contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "schools" ADD CONSTRAINT "FK_849910d038aafddeacc1c8b8a66" FOREIGN KEY ("settingId") REFERENCES "school-settings"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-goals" ADD CONSTRAINT "FK_3e29a107c8ac16558e6b04a61e4" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-projects" ADD CONSTRAINT "FK_5533bfddfa73d9d43d41846084f" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-socials" ADD CONSTRAINT "FK_ccd99dc4a8f2a01fd3385fd7315" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_4fff76d805eea4bd3d10d9bfd18" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_33b70cd9fc87de9443730a7a89a" FOREIGN KEY ("unitId") REFERENCES "course_units"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_448cf5bf72943cda0ff722bc7b7" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_64296897de1b0efdd3a8628efe3" FOREIGN KEY ("progressId") REFERENCES "course-progress"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_likes" ADD CONSTRAINT "FK_093c84a8fa081181895bc068097" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_likes" ADD CONSTRAINT "FK_b59c0c29e2431d6e8802e2c95e9" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_8e0ef34f8d606c64586e698abc1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_9597df3fc3527ac6cc8e38290bb" FOREIGN KEY ("certificateId") REFERENCES "course_certificates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ADD CONSTRAINT "FK_fc8fb8eb3a553b61dc2a92216b7" FOREIGN KEY ("codeAssignmentId") REFERENCES "code-assignment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ADD CONSTRAINT "FK_725f6b01467d283c9656e3d1160" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ADD CONSTRAINT "FK_2529f059707fbefb5252e001a2d" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ADD CONSTRAINT "FK_458ac8829748c9d6dc6428dba84" FOREIGN KEY ("courseUnitId") REFERENCES "course_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ADD CONSTRAINT "FK_464e9d8223d339b797c22d6f3f3" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" ADD CONSTRAINT "FK_544dd8d19ad7bc12c8a1e951a90" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_7857f65e94524a542ecb7de8f89" FOREIGN KEY ("studentProfileId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_e611e0cb5860952e085fb2da02e" FOREIGN KEY ("class-setting") REFERENCES "classes-preferences"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "class-student-pending" ADD CONSTRAINT "FK_fdc08e139fbf948ffa409bc46fc" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "class-student-pending" ADD CONSTRAINT "FK_c67e5639c39bad4a4448a71fc8e" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_c16fdad3aea7ec7b047aedb9afe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "medias" ADD CONSTRAINT "FK_0ca422a52c318ce86181dbf01ed" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "medias" ADD CONSTRAINT "FK_b5b2c71ec00f2600a3df5db6adf" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "User-reset-password" ADD CONSTRAINT "FK_06c84c6ad3b0df6482df025762f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-reset-password" ADD CONSTRAINT "FK_3b79267a808a1fb55738b49dfbf" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_lesson_complete" ADD CONSTRAINT "FK_07f40bfd0dd2b2cad07c39c424d" FOREIGN KEY ("lessonsContentsId") REFERENCES "lessons-contents"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_lesson_complete" ADD CONSTRAINT "FK_ea43eaf5f1036ec0fb1732d0eb4" FOREIGN KEY ("courseProgressId") REFERENCES "course-progress"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-skills" ADD CONSTRAINT "FK_f66593ba240849193c4e53dc45c" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-skills" ADD CONSTRAINT "FK_d2d9b0b47eb11cf6d13572ed4ba" FOREIGN KEY ("lessonsId") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill_assigment" ADD CONSTRAINT "FK_032626f9d5660b5096a38e22621" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill_assigment" ADD CONSTRAINT "FK_4917f07523d0d4d536594ed5ac8" FOREIGN KEY ("assigmentsId") REFERENCES "assigments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons_authors_users" ADD CONSTRAINT "FK_aae5774620832645553906da157" FOREIGN KEY ("lessonsId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons_authors_users" ADD CONSTRAINT "FK_9ed2137163223f971cab6dd5de8" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-integrations" ADD CONSTRAINT "FK_c82a0b4f890aee4974794cac381" FOREIGN KEY ("lessonsId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-integrations" ADD CONSTRAINT "FK_65c55dde9b6d8514f351a994710" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_schools" ADD CONSTRAINT "FK_940bb558bd7ea63faebcf5072d3" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_schools" ADD CONSTRAINT "FK_07321a4ca48e9f8492b0b0d854b" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" ADD CONSTRAINT "FK_2b267c92cd09e12989940b30fde" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" ADD CONSTRAINT "FK_7ea92212ec5ba33043f0ecd3222" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" ADD CONSTRAINT "FK_a7abfd65256f802ddb72a017f1a" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" ADD CONSTRAINT "FK_0646d7ecf819f42f3e9ef960fbc" FOREIGN KEY ("assigmentsId") REFERENCES "assigments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "stuent_classes" ADD CONSTRAINT "FK_fffd3ed59754319faa435a96047" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "stuent_classes" ADD CONSTRAINT "FK_d76397aa93f56b1c7e745d3a59f" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_assigment" ADD CONSTRAINT "FK_f7d2b188cc524701cc228f79650" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_assigment" ADD CONSTRAINT "FK_b0924e08cdf1c575d884c98beb1" FOREIGN KEY ("assigmentsId") REFERENCES "assigments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_schools_schools" ADD CONSTRAINT "FK_6917390cd25319442d535dcab3b" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_schools_schools" ADD CONSTRAINT "FK_e4c60ab36b58635a1b81d780194" FOREIGN KEY ("schoolsId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_classes_classes" ADD CONSTRAINT "FK_8e170858cd3ab67de38e2c122bc" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_classes_classes" ADD CONSTRAINT "FK_d8095732baf98ac1706d80f6ff4" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_units_course_units" ADD CONSTRAINT "FK_d6885f90583993a79f5e1a12afe" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_units_course_units" ADD CONSTRAINT "FK_a507785849a154ef2d81c82cb6a" FOREIGN KEY ("courseUnitsId") REFERENCES "course_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_mentors" ADD CONSTRAINT "FK_8e5b48ab21c821190a9f5a32c81" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_mentors" ADD CONSTRAINT "FK_5ba31bded1dc7c0fd8220e2edbe" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_assigment" ADD CONSTRAINT "FK_87f2f3e1f9500147fc982f8d5b5" FOREIGN KEY ("classesId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_assigment" ADD CONSTRAINT "FK_b4532db1c66b392e9efefecc97e" FOREIGN KEY ("assigmentsId") REFERENCES "assigments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "class_assigment" DROP CONSTRAINT "FK_b4532db1c66b392e9efefecc97e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_assigment" DROP CONSTRAINT "FK_87f2f3e1f9500147fc982f8d5b5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_mentors" DROP CONSTRAINT "FK_5ba31bded1dc7c0fd8220e2edbe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "class_mentors" DROP CONSTRAINT "FK_8e5b48ab21c821190a9f5a32c81"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_units_course_units" DROP CONSTRAINT "FK_a507785849a154ef2d81c82cb6a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_units_course_units" DROP CONSTRAINT "FK_d6885f90583993a79f5e1a12afe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_classes_classes" DROP CONSTRAINT "FK_d8095732baf98ac1706d80f6ff4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_classes_classes" DROP CONSTRAINT "FK_8e170858cd3ab67de38e2c122bc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_schools_schools" DROP CONSTRAINT "FK_e4c60ab36b58635a1b81d780194"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses_schools_schools" DROP CONSTRAINT "FK_6917390cd25319442d535dcab3b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_assigment" DROP CONSTRAINT "FK_b0924e08cdf1c575d884c98beb1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_assigment" DROP CONSTRAINT "FK_f7d2b188cc524701cc228f79650"`,
    )
    await queryRunner.query(
      `ALTER TABLE "stuent_classes" DROP CONSTRAINT "FK_d76397aa93f56b1c7e745d3a59f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "stuent_classes" DROP CONSTRAINT "FK_fffd3ed59754319faa435a96047"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" DROP CONSTRAINT "FK_0646d7ecf819f42f3e9ef960fbc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students_pined_assignment_assigments" DROP CONSTRAINT "FK_a7abfd65256f802ddb72a017f1a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" DROP CONSTRAINT "FK_7ea92212ec5ba33043f0ecd3222"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users_schools" DROP CONSTRAINT "FK_2b267c92cd09e12989940b30fde"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_schools" DROP CONSTRAINT "FK_07321a4ca48e9f8492b0b0d854b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student_schools" DROP CONSTRAINT "FK_940bb558bd7ea63faebcf5072d3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-integrations" DROP CONSTRAINT "FK_65c55dde9b6d8514f351a994710"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-integrations" DROP CONSTRAINT "FK_c82a0b4f890aee4974794cac381"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons_authors_users" DROP CONSTRAINT "FK_9ed2137163223f971cab6dd5de8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons_authors_users" DROP CONSTRAINT "FK_aae5774620832645553906da157"`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill_assigment" DROP CONSTRAINT "FK_4917f07523d0d4d536594ed5ac8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "skill_assigment" DROP CONSTRAINT "FK_032626f9d5660b5096a38e22621"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-skills" DROP CONSTRAINT "FK_d2d9b0b47eb11cf6d13572ed4ba"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-skills" DROP CONSTRAINT "FK_f66593ba240849193c4e53dc45c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_lesson_complete" DROP CONSTRAINT "FK_ea43eaf5f1036ec0fb1732d0eb4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "progress_lesson_complete" DROP CONSTRAINT "FK_07f40bfd0dd2b2cad07c39c424d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-reset-password" DROP CONSTRAINT "FK_3b79267a808a1fb55738b49dfbf"`,
    )
    await queryRunner.query(
      `ALTER TABLE "User-reset-password" DROP CONSTRAINT "FK_06c84c6ad3b0df6482df025762f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "medias" DROP CONSTRAINT "FK_b5b2c71ec00f2600a3df5db6adf"`,
    )
    await queryRunner.query(
      `ALTER TABLE "medias" DROP CONSTRAINT "FK_0ca422a52c318ce86181dbf01ed"`,
    )
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_c16fdad3aea7ec7b047aedb9afe"`,
    )
    await queryRunner.query(
      `ALTER TABLE "class-student-pending" DROP CONSTRAINT "FK_c67e5639c39bad4a4448a71fc8e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "class-student-pending" DROP CONSTRAINT "FK_fdc08e139fbf948ffa409bc46fc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_e611e0cb5860952e085fb2da02e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_17d36b6f6a79669ba76b671ac72"`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_7857f65e94524a542ecb7de8f89"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" DROP CONSTRAINT "FK_544dd8d19ad7bc12c8a1e951a90"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" DROP CONSTRAINT "FK_464e9d8223d339b797c22d6f3f3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" DROP CONSTRAINT "FK_458ac8829748c9d6dc6428dba84"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" DROP CONSTRAINT "FK_2529f059707fbefb5252e001a2d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" DROP CONSTRAINT "FK_725f6b01467d283c9656e3d1160"`,
    )
    await queryRunner.query(
      `ALTER TABLE "assigments" DROP CONSTRAINT "FK_fc8fb8eb3a553b61dc2a92216b7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_9597df3fc3527ac6cc8e38290bb"`,
    )
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_8e0ef34f8d606c64586e698abc1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_likes" DROP CONSTRAINT "FK_b59c0c29e2431d6e8802e2c95e9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_likes" DROP CONSTRAINT "FK_093c84a8fa081181895bc068097"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_64296897de1b0efdd3a8628efe3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_448cf5bf72943cda0ff722bc7b7"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_33b70cd9fc87de9443730a7a89a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_4fff76d805eea4bd3d10d9bfd18"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-socials" DROP CONSTRAINT "FK_ccd99dc4a8f2a01fd3385fd7315"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-projects" DROP CONSTRAINT "FK_5533bfddfa73d9d43d41846084f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-goals" DROP CONSTRAINT "FK_3e29a107c8ac16558e6b04a61e4"`,
    )
    await queryRunner.query(
      `ALTER TABLE "schools" DROP CONSTRAINT "FK_849910d038aafddeacc1c8b8a66"`,
    )
    await queryRunner.query(
      `ALTER TABLE "schools" DROP CONSTRAINT "FK_e6a296ef2dd907d5fdd8aee7a16"`,
    )
    await queryRunner.query(
      `ALTER TABLE "student-invitations" DROP CONSTRAINT "FK_67e55a0785d4a06507c89d0ce72"`,
    )
    await queryRunner.query(
      `ALTER TABLE "school-socials" DROP CONSTRAINT "FK_d6b9de006beeab3d21456126b5e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_rating" DROP CONSTRAINT "FK_7e2c4436f6257f147eb56469fc8"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course_rating" DROP CONSTRAINT "FK_a3d4d5506ab43943558e8618206"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-last-slide" DROP CONSTRAINT "FK_5536b98cc321a13ace98abe47c1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson-last-slide" DROP CONSTRAINT "FK_15cbc96b984b5d53a1cd72f13a2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_d858621aa37f9325bb186c9bc87"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" DROP CONSTRAINT "FK_315937043256b6411035bd3d723"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-contents" DROP CONSTRAINT "FK_deb8a29eef376aab009eb7bffe3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lessons-content-validator" DROP CONSTRAINT "FK_e259cad82c237846034c45e3326"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson_to_course_unit" DROP CONSTRAINT "FK_0091dddc8f7bae9923bcd667804"`,
    )
    await queryRunner.query(
      `ALTER TABLE "lesson_to_course_unit" DROP CONSTRAINT "FK_bace3ead262f3491cbd6787be7d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "course-author" DROP CONSTRAINT "FK_ab22af6cdda162966bbd24e7e85"`,
    )
    await queryRunner.query(
      `ALTER TABLE "auth_token" DROP CONSTRAINT "FK_5a326267f11b44c0d62526bc718"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4532db1c66b392e9efefecc97"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_87f2f3e1f9500147fc982f8d5b"`,
    )
    await queryRunner.query(`DROP TABLE "class_assigment"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5ba31bded1dc7c0fd8220e2edb"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e5b48ab21c821190a9f5a32c8"`,
    )
    await queryRunner.query(`DROP TABLE "class_mentors"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a507785849a154ef2d81c82cb6"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d6885f90583993a79f5e1a12af"`,
    )
    await queryRunner.query(`DROP TABLE "courses_units_course_units"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d8095732baf98ac1706d80f6ff"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e170858cd3ab67de38e2c122b"`,
    )
    await queryRunner.query(`DROP TABLE "courses_classes_classes"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4c60ab36b58635a1b81d78019"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6917390cd25319442d535dcab3"`,
    )
    await queryRunner.query(`DROP TABLE "courses_schools_schools"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b0924e08cdf1c575d884c98beb"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f7d2b188cc524701cc228f7965"`,
    )
    await queryRunner.query(`DROP TABLE "student_assigment"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d76397aa93f56b1c7e745d3a59"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fffd3ed59754319faa435a9604"`,
    )
    await queryRunner.query(`DROP TABLE "stuent_classes"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0646d7ecf819f42f3e9ef960fb"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a7abfd65256f802ddb72a017f1"`,
    )
    await queryRunner.query(`DROP TABLE "students_pined_assignment_assigments"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ea92212ec5ba33043f0ecd322"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2b267c92cd09e12989940b30fd"`,
    )
    await queryRunner.query(`DROP TABLE "users_schools"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07321a4ca48e9f8492b0b0d854"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_940bb558bd7ea63faebcf5072d"`,
    )
    await queryRunner.query(`DROP TABLE "student_schools"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_65c55dde9b6d8514f351a99471"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c82a0b4f890aee4974794cac38"`,
    )
    await queryRunner.query(`DROP TABLE "lesson-integrations"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9ed2137163223f971cab6dd5de"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aae5774620832645553906da15"`,
    )
    await queryRunner.query(`DROP TABLE "lessons_authors_users"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4917f07523d0d4d536594ed5ac"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_032626f9d5660b5096a38e2262"`,
    )
    await queryRunner.query(`DROP TABLE "skill_assigment"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d2d9b0b47eb11cf6d13572ed4b"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f66593ba240849193c4e53dc45"`,
    )
    await queryRunner.query(`DROP TABLE "lesson-skills"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ea43eaf5f1036ec0fb1732d0eb"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07f40bfd0dd2b2cad07c39c424"`,
    )
    await queryRunner.query(`DROP TABLE "progress_lesson_complete"`)
    await queryRunner.query(`DROP TABLE "student-reset-password"`)
    await queryRunner.query(`DROP TABLE "User-reset-password"`)
    await queryRunner.query(`DROP TABLE "medias"`)
    await queryRunner.query(`DROP TYPE "public"."medias_acl_enum"`)
    await queryRunner.query(`DROP TYPE "public"."medias_type_enum"`)
    await queryRunner.query(`DROP TABLE "invitations"`)
    await queryRunner.query(`DROP TABLE "class-student-pending"`)
    await queryRunner.query(`DROP TABLE "classes"`)
    await queryRunner.query(`DROP TABLE "classes-preferences"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
    await queryRunner.query(`DROP TABLE "assigments"`)
    await queryRunner.query(`DROP TYPE "public"."assigments_status_enum"`)
    await queryRunner.query(`DROP TYPE "public"."assigments_category_enum"`)
    await queryRunner.query(`DROP TYPE "public"."assigments_type_enum"`)
    await queryRunner.query(`DROP TABLE "course_units"`)
    await queryRunner.query(`DROP TABLE "courses"`)
    await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`)
    await queryRunner.query(`DROP TABLE "course_likes"`)
    await queryRunner.query(`DROP TABLE "students"`)
    await queryRunner.query(`DROP TABLE "student-socials"`)
    await queryRunner.query(`DROP TABLE "student-projects"`)
    await queryRunner.query(`DROP TABLE "student-goals"`)
    await queryRunner.query(`DROP TABLE "schools"`)
    await queryRunner.query(`DROP TYPE "public"."schools_type_enum"`)
    await queryRunner.query(`DROP TABLE "student-invitations"`)
    await queryRunner.query(`DROP TABLE "school-socials"`)
    await queryRunner.query(`DROP TABLE "school-settings"`)
    await queryRunner.query(`DROP TABLE "school-contacts"`)
    await queryRunner.query(`DROP TABLE "course_rating"`)
    await queryRunner.query(`DROP TABLE "lesson-last-slide"`)
    await queryRunner.query(`DROP TABLE "lessons"`)
    await queryRunner.query(`DROP TYPE "public"."lessons_type_enum"`)
    await queryRunner.query(`DROP TABLE "skills"`)
    await queryRunner.query(`DROP TABLE "lessons-contents"`)
    await queryRunner.query(
      `DROP TYPE "public"."lessons-contents_complexity_enum"`,
    )
    await queryRunner.query(`DROP TYPE "public"."lessons-contents_type_enum"`)
    await queryRunner.query(`DROP TABLE "lessons-content-validator"`)
    await queryRunner.query(`DROP TABLE "course-progress"`)
    await queryRunner.query(`DROP TABLE "integration"`)
    await queryRunner.query(`DROP TABLE "lesson_to_course_unit"`)
    await queryRunner.query(`DROP TABLE "course_certificates"`)
    await queryRunner.query(`DROP TABLE "course-author"`)
    await queryRunner.query(`DROP TABLE "code-assignment"`)
    await queryRunner.query(`DROP TABLE "auth_token"`)
  }
}
