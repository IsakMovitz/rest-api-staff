import { Staff } from "../domain/staff.js";

export interface StaffRepository {
  add(staff: Staff): Promise<void>;
  remove(id: string): Promise<boolean>;
  getAll(): Promise<Staff[]>;
  findByEmail(email: string): Promise<Staff | undefined>;
}
