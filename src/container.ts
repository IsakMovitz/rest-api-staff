import { InMemoryStaffRepository } from "./infra/repositories/inMemoryStaffRepository.js";

const staffRepository = new InMemoryStaffRepository();

export { staffRepository };
