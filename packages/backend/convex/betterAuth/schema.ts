import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";
export const authTables = {
  ...tables,
  user: tables.user.index("by_email", ["email"]).searchIndex("search_by_name", {
    searchField: "name",
    filterFields: ["email"],
  }),
};

const schema = defineSchema(authTables);
export default schema;
