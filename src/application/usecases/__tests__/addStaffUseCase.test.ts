import { describe, it, expect, beforeEach } from "@jest/globals";
import { AddStaffUseCase } from "../addStaffUseCase.js";
import { InMemoryStaffRepository } from "../../../infra/repositories/inMemoryStaffRepository.js";
import { Email } from "../../../domain/email.js";

describe("AddStaffUseCase", () => {
  let useCase: AddStaffUseCase;
  let repository: InMemoryStaffRepository;

  beforeEach(() => {
    repository = new InMemoryStaffRepository();
    useCase = new AddStaffUseCase(repository);
  });

  it("should add a new staff member successfully", async () => {
    const input = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    };

    const staff = await useCase.execute(input);

    expect(staff).toBeDefined();
    expect(staff.firstName).toBe("John");
    expect(staff.lastName).toBe("Doe");
    expect(staff.email.toString()).toBe("john@example.com");
    expect(staff.id).toBeDefined();
    expect(staff.id).toMatch(/^[0-9a-f-]+$/i);
  });

  it("should generate unique IDs for each staff member", async () => {
    const staff1 = await useCase.execute({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    });

    const staff2 = await useCase.execute({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com"
    });

    expect(staff1.id).not.toBe(staff2.id);
  });

  it("should normalize email to lowercase", async () => {
    const staff = await useCase.execute({
      firstName: "Admin",
      lastName: "User",
      email: "Admin@EXAMPLE.COM"
    });

    expect(staff.email.toString()).toBe("admin@example.com");
  });

  it("should throw error for invalid email", async () => {
    const input = {
      firstName: "Invalid",
      lastName: "Email",
      email: "not-an-email"
    };

    await expect(useCase.execute(input)).rejects.toThrow("Invalid email format");
  });

  it("should persist staff member in repository", async () => {
    const input = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com"
    };

    const staff = await useCase.execute(input);
    const allStaff = await repository.getAll();

    expect(allStaff).toHaveLength(1);
    expect(allStaff[0]).toBe(staff);
  });

  it("should create email value object correctly", async () => {
    const email = "valid.email@domain.co.uk";
    const staff = await useCase.execute({
      firstName: "Test",
      lastName: "Domain",
      email: email
    });

    expect(staff.email).toBeInstanceOf(Email);
    expect(staff.email.value).toBe(email);
  });
});
