---
name: be-database
description: Database layer development. Use when: implementing DbFactory adapters, query builders, schema migrations, or data validation. Domain: persistence layer abstraction.
---

# Backend Database Skill

## Architecture Decision

- **DbFactory pattern**: Runtime adapter selection (Lowdb for now MongoDb intended as alternative in future)
- **Adapter interface**: All databases implement `IDatabase` contract
- **No business logic**: Adapters are pure CRUD layer

## Location: `src/main/database/`

- `DbFactory.ts` - Factory selecting Lowdb vs MongoDB
- `LowdbAdapter.ts` - Local JSON database (Lowdb)
- `MongoAdapter.ts` - Remote database (MongoDB)

## Key Contract: `IDatabase`

Methods needed: `query()`, `insert()`, `update()`, `delete()`, `close()`

## Configuration

- Reads from `IDBConfig` in `/common/types.ts`
- Type: `'lowdb'` | `'mongodb'`
- Path/Connection string from config

## Critical Rule: Relative Paths

All asset paths stored relative to project root for portability.

## Adapter Responsibilities

- Handle collections/tables
- Implement filtering logic
- Manage connections (pooling for Mongo)
- Validate data types before insert
