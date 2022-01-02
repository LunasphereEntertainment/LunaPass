export class Account {
  id: number;
  name: string;
  url: string | undefined;
  username: string;
  password: string | undefined;

  // categories: string[];

  constructor(
    id: number,
    name: string,
    username: string,
    password?: string,
    url?: string,
  ) {
    this.id = id;

    this.name = name;
    this.username = username;

    if (password) this.password = password;

    if (url) this.url = url;
  }

  // addCategory(category: string) {
  //   this.categories.push(category);
  // }
  //
  // removeCategory(category: string) {
  //   const idx = this.categories.findIndex((cat) => cat === category);
  //   if (idx > -1) {
  //     this.categories.splice(idx, 1);
  //   }
  // }
}
