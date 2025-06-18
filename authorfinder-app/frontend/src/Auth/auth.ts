/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAuth } from "./iauth";

export class Auth implements IAuth {
  id: string = "";
  email: string = "";
  name: string = "";
  accessToken: string = "";
  refreshToken: string = "";

  constructor(initializer: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.email) this.email = initializer.email;
    if (initializer.name) this.name = initializer.name;
    if (initializer.accessToken) this.accessToken = initializer.accessToken;
    if (initializer.refreshToken) this.refreshToken = initializer.refreshToken;
  }
}
