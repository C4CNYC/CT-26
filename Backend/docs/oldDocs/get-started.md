---
title: Getting Started (Old)
description: Old setup guide from when the backend was called CT-Middleware (install, database, environment, dev mode, cloning the staging database). Check tech.md first.
---

# Getting Started with CT-Middleware

This guide will walk you through the steps to get started with CT-Middleware

## Table of Contents

- [Getting Started with CT-Middleware](#getting-started-with-ct-middleware)
- [Prerequisites](#prerequisites)
- [Step 1: Package Installation](#step-1-package-installation)
- [Step 2: DB Init](#step-2-db-init)
- [Step 3: Set up your environment](#step-3-set-up-your-environment)
- [Step 4: Run Dev Mode](#step-4-run-dev-mode)

## Getting Started with CT-Middleware

This guide will walk you through the steps to get started with CT-Middleware

...

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- NVM
- Docker

## Step 1: Package Installation

1. `nvm use`
2. `npm install`

## Step 2: DB Init

```bash
docker-compose up
```

### Step 3: Set up your environment

```bash
$ cp -p .env.dev .env
```

## Step 4: Run Dev Mode

```bash
npm run start:dev
```

### If using local DB, a one-liner to clone staging db to your local postgres instance (give it a few minutes to run)

```bash
$ pg_dump --no-owner --no-privileges --dbname=postgresql://codepanel_dev:C7AFsaaUAXA47aBA@codepanel.ceviynmushjy.us-east-1.rds.amazonaws.com:5432/development | psql postgresql://{USER}:{PASSWORD}@localhost:5432/{DB_NAME}
```
