import { StaffRepository } from "../../repositories/staffRepository.js";
import { Staff } from "../../domain/staff.js";
import { Email } from "../../domain/email.js";
import { v4 as uuidv4 } from "uuid";

export class AddStaffUseCase {
  constructor(private repo: StaffRepository) {}

  async execute(input: { firstName: string; lastName: string; email: string }): Promise<Staff> {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) {
      throw new Error("Email already exists");
    }

    const id = uuidv4();
    const email = new Email(input.email);
    const staff = new Staff({ id, firstName: input.firstName, lastName: input.lastName, email });
    await this.repo.add(staff);
    return staff;
  }
}
