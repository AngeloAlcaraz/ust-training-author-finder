/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IAuth } from "./iauth";

export class Auth implements IAuth {
  message: string = " ";
  data: {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
  } = {
    id: "",
    email: "",
    name: "",
    accessToken: "",
    refreshToken: "",
  };

  constructor(initializer: any) {
    if (!initializer) return;
    if (initializer.message) this.message = initializer.message;
    if (initializer.data !== undefined) {
      this.data = initializer.data;
    }
  }
}
