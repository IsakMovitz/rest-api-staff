import { StaffRepository } from "../../repositories/staffRepository.js";
import { Staff } from "../../domain/staff.js";

export class InMemoryStaffRepository implements StaffRepository {
  private items: Map<string, Staff> = new Map();

  async add(staff: Staff): Promise<void> {
    this.items.set(staff.id, staff);
  }

  async remove(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async getAll(): Promise<Staff[]> {
    return Array.from(this.items.values());
  }

  async findByEmail(email: string): Promise<Staff | undefined> {
    for (const s of this.items.values()) {
      if (s.email.toString() === email.toLowerCase()) return s;
    }
    return undefined;
  }
}
