import { Favorite } from "../model/Favorite";
import authHeader from "./auth-header";

const baseUrl = "http://localhost:4000/api/v1/favorites/";
// const authorsUrl = `${baseUrl}authors/`;
// const searchUrl = `${baseUrl}search/authors.json?q=`;

function convertToFavoriteModels(data: any): Favorite[] {
  const favorites: Favorite[] = data.map(convertToFavoriteModel);

  // const favorites: Favorite[] = [];
  // if (item.success) {
  //   item.data.forEach((element: any) => {
  //     favorites.push(new Favorite(element));
  //   });
  // }
  return favorites;
}

function convertToFavoriteModel(item: any): Favorite {
  return new Favorite(item);
}

const favoritesAPI = {
  async getFavoritesByUser(userId: string | undefined): Promise<any> {
    // Fetch author details
    const favoritesResponse = await fetch(`${baseUrl}${userId}`, {
      headers: {
        Authorization: authHeader(),
      },
    });
    if (!favoritesResponse.ok)
      throw new Error(
        `Failed to fetch favorite details: ${favoritesResponse.status}`
      );
    const favoritesData = await favoritesResponse.json();

    if (favoritesData.success) {
      console.log(favoritesData.message);
      const response = convertToFavoriteModels(favoritesData.data);
      console.log("RESPUESTA DESDE ELSERVICIO:" + response);
      return response;
    }

    return undefined;
  },
  async addFavoriteToUser(favorite: Favorite | undefined): Promise<any[]> {
    // Fetch author's works
    const response = await fetch(`${baseUrl}favorites`, {
      method: "post",
      body: JSON.stringify(favorite),
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save favorite for user ${favorite?.addedBy}: ${response.status}`
      );
    }
    const data = await response.json();
    console.log("Works Data:", data);

    return data || [];
  },
  // async getAuthorsByName(name: string): Promise<Author[]> {
  //   const response = await fetch(`${searchUrl}${name}`);
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   console.log("Search Results:", data.docs);

  //   return data.docs;
  // },
};

export default favoritesAPI;
