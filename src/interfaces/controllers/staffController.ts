import { Context } from "hono";
import { staffRepository } from "../../container.js";
import { AddStaffUseCase } from "../../application/usecases/addStaffUseCase.js";
import { RemoveStaffUseCase } from "../../application/usecases/removeStaffUseCase.js";
import { GetAllStaffUseCase } from "../../application/usecases/getAllStaffUseCase.js";
import { CreateStaffDTO, CreateStaffSchema } from "../../dto/createStaffDTO.js";
import z from "zod";

export class StaffController {
  async create(c: Context) {
    const body = await c.req.json();
    const parsed = CreateStaffSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "invalid request", details: z.treeifyError(parsed.error) }, 400);
    }
    const payload: CreateStaffDTO = parsed.data;

    const repo = staffRepository;

    try {
      const uc = new AddStaffUseCase(repo);
      const staff = await uc.execute({ firstName: payload.firstName, lastName: payload.lastName, email: payload.email});
      return c.json(staff, 201);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.message && err.message.toLowerCase().includes("invalid email")) {
        return c.json({ error: err.message }, 400);
      }
      if (err?.message && err.message.toLowerCase().includes("already exists")) {
        return c.json({ error: err.message }, 409);
      }
      return c.json({ error: "internal server error" }, 500);
    }
  }

  async remove(c: Context) {
    const id = c.req.param("id");
    const repo = staffRepository;
    const uc = new RemoveStaffUseCase(repo);
    const removed = await uc.execute(id);
    if (!removed) return c.json({ error: "not found" }, 404);
    return c.body(null, 204);
  }

  async list(c: Context) {
    const repo = staffRepository;
    const uc = new GetAllStaffUseCase(repo);
    const items = await uc.execute();
    return c.json(items);
  }
}
