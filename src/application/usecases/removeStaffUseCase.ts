import { StaffRepository } from "../../repositories/staffRepository.js";

export class RemoveStaffUseCase {
  constructor(private repo: StaffRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.repo.remove(id);
  }
}
