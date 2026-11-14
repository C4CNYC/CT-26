---
title: TypeORM Migrations (Old)
description: Old guide to creating, applying and rolling back TypeORM migrations. Check the scripts in Backend/package.json before running anything.
---

# TypeORM Migration Documentation

## Introduction

This document provides an overview of the migration process using TypeORM. It includes step-by-step instructions and best practices for creating and applying migrations in your project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Creating a Migration](#creating-a-migration)
- [Applying Migrations](#applying-migrations)
- [Rolling Back Migrations](#rolling-back-migrations)
- [Additional Resources](#additional-resources)

## Prerequisites

Before you can start using TypeORM migrations, make sure you have the following prerequisites in place:

- TypeORM installed in your project
- Database connection configured in your project

## Creating a Migration

To create a new migration, follow these steps:

1. Open a terminal and navigate to your project directory.
2. Run the following command to generate a new migration file:
   ```bash
    npm run migration:generate <MigrationName>
   ```
   Replace `<MigrationName>` with a descriptive name for your migration.
3. TypeORM will generate a new migration file in the `migrations` directory of your project.

## Applying Migrations

To apply migrations and update your database schema, follow these steps:

1. Open a terminal and navigate to your project directory.
2. Restart project and migrations are supposed to be run automatically

## Rolling Back Migrations

Be careful as rolling back migration doesn't suport at this moment

## Additional Resources

- [TypeORM Documentation](https://typeorm.io)
- [TypeORM GitHub Repository](https://github.com/typeorm/typeorm)
