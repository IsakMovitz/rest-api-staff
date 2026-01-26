import { Hono } from "hono";
import { StaffController } from "../controllers/staffController.js";

const router = new Hono();
const controller = new StaffController();

router.post("/", (c) => controller.create(c));
router.get("/", (c) => controller.list(c));
router.delete("/:id", (c) => controller.remove(c));

export default router;
