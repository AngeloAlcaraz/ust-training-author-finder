import { Auth } from "../Auth/auth";
import type { IAuth } from "../Auth/iauth";
import { LoginErroMessage } from "../Auth/loginErrorMessage";

/* eslint-disable @typescript-eslint/no-explicit-any */
//const API_URL = "http://localhost:4000/api/v1/auth";

const API_URL = "http://13.221.227.133:4000/api/v1/auth";
function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return "Please login again.";
    case 403:
      return "You do not have permission to view the project(s).";
    default:
      return "There was an error retrieving the project(s). Please try again.";
  }
}

function checkStatus(response: any) {
  if (response.ok) {
    return response;
  }

  if (response.status == "400") {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    const errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response: Response) {
  return response.json();
}

function convertToAuthtModel(item: any): IAuth | LoginErroMessage {
  if (item.data.accessToken) return new Auth(item);
  else return new LoginErroMessage(item);
}

function saveToLocalStorage(user: any): IAuth | LoginErroMessage {
  if (user.data.accessToken) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
}

const authServiceAPI = {
  login(email: string, password: string) {
    return fetch(`${API_URL}/signin`, {
      method: "post",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(convertToAuthtModel)
      .then(saveToLocalStorage)
      .catch((error: TypeError) => {
        console.log("log client error " + error);
        throw new Error("There was an error to login. Please try again.");
      });
  },
  logout() {
    //Todo: Call to backend service to delete the token
    localStorage.removeItem("user");
  },
  register(name: string, email: string, password: string, gender: "male") {
    return fetch(`${API_URL}/signup`, {
      method: "post",
      body: JSON.stringify({
        name,
        email,
        password,
        gender,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(convertToAuthtModel)
      .then(saveToLocalStorage)
      .catch((error: TypeError) => {
        console.log("log client error " + error);
        throw new Error("There was an error to register. Please try again.");
      });
  },
  getCurrentUser() {
    const currentUser = localStorage.getItem("user");

    if (currentUser) {
      return JSON.parse(currentUser);
    }
  },
};

export { authServiceAPI };
