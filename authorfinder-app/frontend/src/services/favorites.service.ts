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
      return response;
    }

    return undefined;
  },
  async addFavoriteToUser(favorite: Favorite | undefined): Promise<any> {
    const response = await fetch(`${baseUrl}`, {
      method: "post",
      body: JSON.stringify({
        authorId: favorite?.authorId,
        name: favorite?.name,
        imageUrl: favorite?.imageUrl,
        birthDate: "1800-01-01",
        deathDate: favorite?.deathDate,
        topWork: favorite?.topWork,
        addedBy: favorite?.addedBy,
        addedAt: "2025-06-15T12:34:56.000Z",
      }),
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

    console.log(data.message);
    const responseConverted = convertToFavoriteModels(data.data);
    console.log("RESPUESTA DESDE ELSERVICIO:" + responseConverted);

    return responseConverted;
  },
  async deleteFavoriteToUser(addedBy: string, authorId: string): Promise<any> {
    const response = await fetch(`${baseUrl}${addedBy}/${authorId}`, {
      method: "delete",
      // body: JSON.stringify({
      //   addedBy: userId,
      //   authorId: authorId,
      // }),
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete favorite for user ${addedBy}: ${response.status}`
      );
    }

    const data = await response.json();

    if (data.success) {
      console.log(data.message);
    }
  },
};

export default favoritesAPI;
