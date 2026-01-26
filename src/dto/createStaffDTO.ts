import { z } from "zod";

export const CreateStaffSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email()
});

export type CreateStaffDTO = z.infer<typeof CreateStaffSchema>;
