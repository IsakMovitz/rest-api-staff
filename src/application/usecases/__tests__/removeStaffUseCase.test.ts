import { describe, it, expect, beforeEach } from "@jest/globals";
import { RemoveStaffUseCase } from "../removeStaffUseCase.js";
import { InMemoryStaffRepository } from "../../../infra/repositories/inMemoryStaffRepository.js";
import { Staff } from "../../../domain/staff.js";
import { Email } from "../../../domain/email.js";

describe("RemoveStaffUseCase", () => {
  let useCase: RemoveStaffUseCase;
  let repository: InMemoryStaffRepository;

  beforeEach(() => {
    repository = new InMemoryStaffRepository();
    useCase = new RemoveStaffUseCase(repository);
  });

  it("should remove an existing staff member", async () => {
    const staff = new Staff({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: new Email("john@example.com")
    });

    await repository.add(staff);

    const result = await useCase.execute("1");

    expect(result).toBe(true);
    const allStaff = await repository.getAll();
    expect(allStaff).toHaveLength(0);
  });

  it("should return false when removing non-existent staff", async () => {
    const result = await useCase.execute("non-existent-id");

    expect(result).toBe(false);
  });

  it("should remove only the specified staff member", async () => {
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

    const result = await useCase.execute("1");

    expect(result).toBe(true);
    const remaining = await repository.getAll();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toBe(staff2);
  });

  it("should return false on second removal of same id", async () => {
    const staff = new Staff({
      id: "1",
      firstName: "Test",
      lastName: "User",
      email: new Email("test@example.com")
    });

    await repository.add(staff);

    const firstRemoval = await useCase.execute("1");
    const secondRemoval = await useCase.execute("1");

    expect(firstRemoval).toBe(true);
    expect(secondRemoval).toBe(false);
  });

  it("should not affect other staff when removal fails", async () => {
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

    const result = await useCase.execute("non-existent");

    expect(result).toBe(false);
    const allStaff = await repository.getAll();
    expect(allStaff).toHaveLength(2);
  });
});
