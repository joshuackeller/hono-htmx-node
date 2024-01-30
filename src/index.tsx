import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { html } from "hono/html";
import { TodoItem } from "../components/TodoItem";
import { nanoid } from "nanoid";

import { drizzle } from "drizzle-orm/postgres-js";
import { todo } from "../drizzle/schema";
const postgres = require("postgres");
import * as schema from "../drizzle/schema";
import * as dotenv from "dotenv";
import { desc, eq } from "drizzle-orm";
dotenv.config();

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props: { title: string | undefined },
    ): Response;
  }
}

const app = new Hono();

app.get("/test", async (c) => {
  const todos = await db.select().from(todo);

  return c.json(todos);
});

app.get(
  "*",
  jsxRenderer(({ children, title }) => {
    return html`
        <head>
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script
            src="https://unpkg.com/htmx.org@1.9.10"
            integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
            crossorigin="anonymous"
          ></script>
        </head>
        <body>
          <div class="mx-4 my-2">${children}</div>
        </body>
      </html>
    `;
  }),
);

app.post("/todos", async (c) => {
  const formData = await c.req.formData();

  const newTodo = await db
    .insert(todo)
    .values({ id: nanoid(), name: formData.get("name") as string })
    .returning();

  return c.html(<TodoItem todo={newTodo[0]} />);
});

app.delete("/todos/:todoId", async (c) => {
  const todoId = c.req.param("todoId");

  await db.delete(todo).where(eq(todo.id, todoId));
  return c.html(<div></div>);
});

app.get("/", async (c) => {
  const todos = await db.select().from(todo).orderBy(desc(todo.createdAt));
  return c.render(
    <>
      <div>
        <form
          hx-post="/todos"
          hx-trigger="submit"
          hx-target="#todos"
          hx-swap="afterbegin"
          hx-reset-on-success
          class="my-2 flex gap-x-2"
        >
          <input
            type="text"
            name="name"
            class="py-1 px-2 border"
            placeholder="More..."
          />
          <button type="submit" class="px-5 px-2 bg-indigo-500 text-white">
            Add
          </button>
        </form>
        <div id="todos">
          {todos.map((todo) => (
            <TodoItem todo={todo} />
          ))}
        </div>
      </div>
      {html`
        <script>
          document.body.addEventListener("htmx:afterOnLoad", function (event) {
            // Check if the target is a form
            if (event.target.tagName.toLowerCase() === "form") {
              // Clear all input fields in the form
              event.target.querySelectorAll("input").forEach(function (input) {
                if (input.type !== "submit") {
                  // Don't clear submit buttons
                  input.value = "";
                }
              });
            }
          });
        </script>
      `}
    </>,
    { title: "Cool" },
  );
});

serve(app);
