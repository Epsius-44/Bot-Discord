import { defineConfig } from "@mikro-orm/mongodb";
import { Group, Guild, Moderation, User } from "./entities/index.js";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  entities: [User, Guild, Group, Moderation],
  dbName: process.env.MONGO_DB_NAME || "test",
  clientUrl: process.env.MONGO_URI || "mongodb://localhost:27017",
  debug: process.env.NODE_ENV !== "production"
});
