export class UserAccount {
  // tslint:disable-next-line:variable-name
  user_id: number | undefined;
  username: string;
  email: string;
  password: string;
  token: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;

  constructor(username: string, password: string, email?: string) {
    this.username = username;
    this.password = password;
    this.email = email || '';
  }
}
