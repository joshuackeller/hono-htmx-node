import {
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const todo = pgTable("todo", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
});

