import { StaffRepository } from "../../repositories/staffRepository.js";
import { Staff } from "../../domain/staff.js";

export class GetAllStaffUseCase {
  constructor(private repo: StaffRepository) {}

  async execute(): Promise<Staff[]> {
    return this.repo.getAll();
  }
}
