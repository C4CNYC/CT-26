---
title: Database Schema
description: How the main entities relate (organizations, users, schools, students, courses, lessons), their key fields, the join tables and common patterns.
---

# Database Schema

## Core Relationships

### User Management
```
Organization (1) → (N) User
Organization (1) → (N) School
User (1) ↔ (1) Student (via student_profile)
User (N) ↔ (N) School (teachers)
```

### Educational Structure
```
Course (N) ↔ (N) CourseUnit
CourseUnit (N) ↔ (N) Lesson
Course (N) ↔ (N) School
Course (N) ↔ (N) Class
```

### Student Enrollment
```
Student (N) ↔ (N) School
Student (N) ↔ (N) Class
Student (N) → (1) Course (current)
Student (N) → (1) Lesson (current)
Student (1) → (N) CourseProgress
```

## Key Entities

### User
- **PK**: `id` (UUID)
- **Fields**: `email`, `role`, `first_name`, `last_name`, `avatar`, `verified`, `active`
- **Relationships**:
  - `organization` (ManyToOne)
  - `student_profile` (OneToOne)
  - `schools` (ManyToMany - teachers)
  - `courses` (ManyToMany - authors)

### Organization
- **PK**: `id` (UUID)
- **Fields**: `name`, `slug`, `domain`, `logo`, `subdomain`
- **Relationships**:
  - `users` (OneToMany)
  - `schools` (OneToMany)
  - `owner` (OneToOne User)

### Student
- **PK**: `id` (UUID)
- **Fields**: `username`, `first_name`, `last_name`, `verified`, `active`, `avatar`
- **Relationships**:
  - `account` (OneToOne User)
  - `course` (ManyToOne - current)
  - `lesson` (ManyToOne - current)
  - `schools` (ManyToMany)
  - `classes` (ManyToMany)

### Course
- **PK**: `id` (UUID)
- **Fields**: `name`, `price`, `level`, `age`, `description`, `cover`, `active`, `public`
- **Relationships**:
  - `user` (ManyToOne - creator)
  - `units` (ManyToMany)
  - `schools` (ManyToMany)
  - `classes` (ManyToMany)
  - `students` (OneToMany)

### Lesson
- **PK**: `id` (UUID)
- **Fields**: `name`, `type`, `description`, `active`, `draft`, `slug`
- **Relationships**:
  - `user` (ManyToOne - creator)
  - `authors` (ManyToMany User)
  - `units` (ManyToMany CourseUnit)
  - `contents` (OneToMany)
  - `school` (ManyToOne)

### School
- **PK**: `id` (UUID)
- **Fields**: `name`, `country`, `address`, `type`, `active`
- **Relationships**:
  - `organization` (ManyToOne)
  - `teachers` (ManyToMany User)
  - `students` (ManyToMany)
  - `classes` (OneToMany)
  - `courses` (ManyToMany)

## Join Tables

### Many-to-Many Relationships
- `users_schools` - User ↔ School (teachers)
- `student_schools` - Student ↔ School
- `stuent_classes` - Student ↔ Class
- `student_assigment` - Student ↔ Assignment
- `lesson_to_course_unit` - Lesson ↔ CourseUnit

## Key Patterns

### Base Entity
All entities inherit:
- `id` (UUID primary key)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Soft Delete
Most relationships use `onDelete: 'SET NULL'` or `onDelete: 'CASCADE'`

### Metadata
Many entities include `meta` (JSON) field for flexible data storage

### Slugs & Identifiers
- `content_id` (Course) - unique content identifier
- `slug` (Lesson, Organization) - URL-friendly identifiers
- `username` (User, Student) - unique usernames