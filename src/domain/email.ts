export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new Error("Invalid email format");
    }
    this._value = value.toLowerCase();
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== "string") return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }

  equals(other: Email | string): boolean {
    if (typeof other === "string") return this._value === other.toLowerCase();
    return this._value === other._value;
  }
}
