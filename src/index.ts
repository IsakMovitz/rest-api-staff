import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import staffRoutes from "./interfaces/routes/staffRoutes.js";
import "./container.js";

const app = new Hono();
app.use(cors());

app.route("/staff", staffRoutes);

const PORT = Number(process.env.PORT) || 3000;
serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${info.port}`);
});
