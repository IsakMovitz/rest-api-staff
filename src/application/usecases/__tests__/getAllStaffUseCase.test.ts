import { describe, it, expect, beforeEach } from "@jest/globals";
import { GetAllStaffUseCase } from "../getAllStaffUseCase.js";
import { InMemoryStaffRepository } from "../../../infra/repositories/inMemoryStaffRepository.js";
import { Staff } from "../../../domain/staff.js";
import { Email } from "../../../domain/email.js";

describe("GetAllStaffUseCase", () => {
  let useCase: GetAllStaffUseCase;
  let repository: InMemoryStaffRepository;

  beforeEach(() => {
    repository = new InMemoryStaffRepository();
    useCase = new GetAllStaffUseCase(repository);
  });

  it("should return empty array when no staff exist", async () => {
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it("should return all staff members", async () => {
    const staff1 = new Staff({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: new Email("john@example.com")
    });

    const staff2 = new Staff({
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: new Email("jane@example.com")
    });

    await repository.add(staff1);
    await repository.add(staff2);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toContain(staff1);
    expect(result).toContain(staff2);
  });

  it("should return staff in consistent order", async () => {
    const staff1 = new Staff({
      id: "1",
      firstName: "Alice",
      lastName: "A",
      email: new Email("alice@example.com")
    });

    const staff2 = new Staff({
      id: "2",
      firstName: "Bob",
      lastName: "B",
      email: new Email("bob@example.com")
    });

    const staff3 = new Staff({
      id: "3",
      firstName: "Charlie",
      lastName: "C",
      email: new Email("charlie@example.com")
    });

    await repository.add(staff1);
    await repository.add(staff2);
    await repository.add(staff3);

    const result1 = await useCase.execute();
    const result2 = await useCase.execute();

    expect(result1).toEqual(result2);
  });

  it("should reflect repository changes", async () => {
    const staff1 = new Staff({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: new Email("john@example.com")
    });

    await repository.add(staff1);
    const result1 = await useCase.execute();
    expect(result1).toHaveLength(1);

    const staff2 = new Staff({
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: new Email("jane@example.com")
    });

    await repository.add(staff2);
    const result2 = await useCase.execute();
    expect(result2).toHaveLength(2);
  });

  it("should return multiple calls independently", async () => {
    const staff = new Staff({
      id: "1",
      firstName: "Test",
      lastName: "User",
      email: new Email("test@example.com")
    });

    await repository.add(staff);

    const result1 = await useCase.execute();
    const result2 = await useCase.execute();

    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });
});
