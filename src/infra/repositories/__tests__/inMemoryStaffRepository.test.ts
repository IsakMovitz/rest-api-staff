import { describe, it, expect, beforeEach } from "@jest/globals";
import { InMemoryStaffRepository } from "../inMemoryStaffRepository.js";
import { Staff } from "../../../domain/staff.js";
import { Email } from "../../../domain/email.js";

describe("InMemoryStaffRepository", () => {
  let repository: InMemoryStaffRepository;
  let staff1: Staff;
  let staff2: Staff;

  beforeEach(() => {
    repository = new InMemoryStaffRepository();

    staff1 = new Staff({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: new Email("john@example.com")
    });

    staff2 = new Staff({
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: new Email("jane@example.com")
    });
  });

  describe("add", () => {
    it("should add a staff member to the repository", async () => {
      await repository.add(staff1);
      const all = await repository.getAll();

      expect(all).toHaveLength(1);
      expect(all[0]).toBe(staff1);
    });

    it("should add multiple staff members", async () => {
      await repository.add(staff1);
      await repository.add(staff2);

      const all = await repository.getAll();
      expect(all).toHaveLength(2);
    });

    it("should overwrite staff with same id", async () => {
      await repository.add(staff1);

      const staff1Modified = new Staff({
        id: "1",
        firstName: "Jonathan",
        lastName: "Doe",
        email: new Email("jonathan@example.com")
      });

      await repository.add(staff1Modified);
      const all = await repository.getAll();

      expect(all).toHaveLength(1);
      expect(all[0].firstName).toBe("Jonathan");
    });
  });

  describe("remove", () => {
    it("should remove a staff member by id", async () => {
      await repository.add(staff1);
      await repository.add(staff2);

      const removed = await repository.remove("1");

      expect(removed).toBe(true);
      const all = await repository.getAll();
      expect(all).toHaveLength(1);
      expect(all[0]).toBe(staff2);
    });

    it("should return false when removing non-existent staff", async () => {
      const removed = await repository.remove("non-existent");
      expect(removed).toBe(false);
    });

    it("should be idempotent", async () => {
      await repository.add(staff1);

      await repository.remove("1");
      const secondRemoval = await repository.remove("1");

      expect(secondRemoval).toBe(false);
    });
  });

  describe("getAll", () => {
    it("should return empty array when no staff members exist", async () => {
      const all = await repository.getAll();
      expect(all).toEqual([]);
    });

    it("should return all staff members", async () => {
      await repository.add(staff1);
      await repository.add(staff2);

      const all = await repository.getAll();

      expect(all).toHaveLength(2);
      expect(all).toContain(staff1);
      expect(all).toContain(staff2);
    });

    it("should return copy of staff list", async () => {
      await repository.add(staff1);

      const all1 = await repository.getAll();
      const all2 = await repository.getAll();

      expect(all1).not.toBe(all2);
      expect(all1).toEqual(all2);
    });
  });

  describe("findByEmail", () => {
    it("should find staff by email", async () => {
      await repository.add(staff1);
      await repository.add(staff2);

      const found = await repository.findByEmail("john@example.com");

      expect(found).toBe(staff1);
    });

    it("should return undefined when email not found", async () => {
      await repository.add(staff1);

      const found = await repository.findByEmail("notfound@example.com");

      expect(found).toBeUndefined();
    });

    it("should be case-insensitive", async () => {
      await repository.add(staff1);

      const found1 = await repository.findByEmail("JOHN@EXAMPLE.COM");
      const found2 = await repository.findByEmail("John@Example.Com");

      expect(found1).toBe(staff1);
      expect(found2).toBe(staff1);
    });

    it("should return undefined when repository is empty", async () => {
      const found = await repository.findByEmail("any@example.com");

      expect(found).toBeUndefined();
    });

    it("should find correct staff when multiple exist", async () => {
      await repository.add(staff1);
      await repository.add(staff2);

      const found1 = await repository.findByEmail("jane@example.com");
      const found2 = await repository.findByEmail("john@example.com");

      expect(found1).toBe(staff2);
      expect(found2).toBe(staff1);
    });
  });
});
