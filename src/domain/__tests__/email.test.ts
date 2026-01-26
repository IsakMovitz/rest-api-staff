import { describe, it, expect } from "@jest/globals";
import { Email } from "../email.js";

describe("Email Value Object", () => {
  describe("constructor", () => {
    it("should create an email with valid format", () => {
      const email = new Email("john@example.com");
      expect(email.value).toBe("john@example.com");
    });

    it("should normalize email to lowercase", () => {
      const email = new Email("John@EXAMPLE.COM");
      expect(email.value).toBe("john@example.com");
    });

    it("should throw error for invalid email format", () => {
      expect(() => new Email("invalid-email")).toThrow("Invalid email format");
    });

    it("should throw error for empty email", () => {
      expect(() => new Email("")).toThrow("Invalid email format");
    });

    it("should throw error for email without @", () => {
      expect(() => new Email("johndoe.com")).toThrow("Invalid email format");
    });

    it("should throw error for email without domain", () => {
      expect(() => new Email("john@")).toThrow("Invalid email format");
    });

    it("should throw error for email without extension", () => {
      expect(() => new Email("john@example")).toThrow("Invalid email format");
    });

    it("should throw error for null or undefined", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new Email(null as any)).toThrow("Invalid email format");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => new Email(undefined as any)).toThrow("Invalid email format");
    });
  });

  describe("isValid", () => {
    it("should validate correct email formats", () => {
      expect(Email.isValid("user@domain.com")).toBe(true);
      expect(Email.isValid("john.doe@company.co.uk")).toBe(true);
      expect(Email.isValid("admin+tag@site.org")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(Email.isValid("notanemail")).toBe(false);
      expect(Email.isValid("@domain.com")).toBe(false);
      expect(Email.isValid("user@")).toBe(false);
      expect(Email.isValid("user domain@test.com")).toBe(false);
    });
  });

  describe("toString", () => {
    it("should return normalized email string", () => {
      const email = new Email("Test@Example.COM");
      expect(email.toString()).toBe("test@example.com");
    });
  });

  describe("toJSON", () => {
    it("should return normalized email string", () => {
      const email = new Email("Admin@Test.org");
      expect(email.toJSON()).toBe("admin@test.org");
    });
  });

  describe("equals", () => {
    it("should compare with another Email object", () => {
      const email1 = new Email("user@example.com");
      const email2 = new Email("user@example.com");
      const email3 = new Email("other@example.com");

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });

    it("should compare with string (case-insensitive)", () => {
      const email = new Email("user@example.com");

      expect(email.equals("user@example.com")).toBe(true);
      expect(email.equals("USER@EXAMPLE.COM")).toBe(true);
      expect(email.equals("other@example.com")).toBe(false);
    });
  });

  describe("value getter", () => {
    it("should return the normalized value", () => {
      const email = new Email("Test@Domain.com");
      expect(email.value).toBe("test@domain.com");
    });
  });
});
