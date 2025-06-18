import type { ILoginErroMessage } from "./iloginErrorMessage";

export class LoginErroMessage implements ILoginErroMessage{
  message: string = "";
  error: string ="";
  statusCode: string ="";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(initializer:any){

    if(!initializer) return ;
    if(initializer.message) this.message = initializer.message;
    if(initializer.error) this.error = initializer.error;
    if(initializer.statusCode) this.statusCode = initializer.statusCode;

  }

}