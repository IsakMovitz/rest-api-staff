import { describe, it, expect } from "@jest/globals";
import { Staff } from "../staff.js";
import { Email } from "../email.js";

describe("Staff Domain Model", () => {
  describe("constructor", () => {
    it("should create a staff member with all properties", () => {
      const email = new Email("john@example.com");
      const staff = new Staff({
        id: "123",
        firstName: "John",
        lastName: "Doe",
        email: email
      });

      expect(staff.id).toBe("123");
      expect(staff.firstName).toBe("John");
      expect(staff.lastName).toBe("Doe");
      expect(staff.email).toBe(email);
    });
  });

  describe("properties", () => {
    it("should have readonly id property", () => {
      const email = new Email("test@example.com");
      const staff = new Staff({
        id: "abc123",
        firstName: "Jane",
        lastName: "Smith",
        email: email
      });

      expect(staff.id).toBe("abc123");
      // id is readonly at the type level, but not enforced at runtime in TypeScript
      // This test verifies the property exists and can be read
      const id = staff.id;
      expect(id).toBe("abc123");
    });

    it("should allow modifying non-id properties", () => {
      const email = new Email("test@example.com");
      const staff = new Staff({
        id: "123",
        firstName: "Alice",
        lastName: "Johnson",
        email: email
      });

      staff.firstName = "Alicia";
      expect(staff.firstName).toBe("Alicia");
    });
  });

  describe("toJSON", () => {
    it("should return serializable object with email as string", () => {
      const email = new Email("john.doe@company.com");
      const staff = new Staff({
        id: "emp-001",
        firstName: "John",
        lastName: "Doe",
        email: email
      });

      const json = staff.toJSON();

      expect(json).toEqual({
        id: "emp-001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com"
      });
    });

    it("should normalize email to lowercase in JSON", () => {
      const email = new Email("Admin@Example.ORG");
      const staff = new Staff({
        id: "admin-1",
        firstName: "Admin",
        lastName: "User",
        email: email
      });

      const json = staff.toJSON();
      expect(json.email).toBe("admin@example.org");
    });
  });
});
