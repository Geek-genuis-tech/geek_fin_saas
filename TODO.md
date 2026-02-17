# TODO: Backend Foundation with Prisma for GEEK-FIN

## Step 1: Install Prisma Dependencies
- [X] Install `prisma` (dev dependency)
- [X] Install `@prisma/client` (production dependency)
- [X] Initialize Prisma with `npx prisma init` - À FAIRE

## Step 2: Create Prisma Schema
- [X] Create `prisma/schema.prisma` with models:
  - [X] Role (enum: admin, manager, user)
  - [X] User (links to Role)
  - [X] Client
  - [X] Employee
  - [X] Operation (links to User)
  - [X] Budget
  - [X] Invoice (links to Client)
  - [X] CashRegister
  - [X] CashTransaction

## Step 3: Create Database Client
- [X] Create `lib/db.ts` with singleton pattern for Prisma Client

## Step 4: Create Environment File
- [x] Create `.env.local` with DATABASE_URL placeholder

## Step 5: Generate Prisma Client
- [x] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (syncing schema with database... in progress)

## Verification
- [ ] Verify no frontend components were modified
- [ ] Verify project still runs with localStorage

