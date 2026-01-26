import { Email } from "./email.js";

export type StaffProps = {
  id: string;
  firstName: string;
  lastName: string;
  email: Email;
};

export class Staff {
  readonly id: string;
  firstName: string;
  lastName: string;
  email: Email;

  constructor(props: StaffProps) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.toString()
    };
  }
}
