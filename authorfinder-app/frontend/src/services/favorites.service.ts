import type { Favorite } from "../model/favorite";

const baseUrl = "http://localhost:3001/api/v1/favorites/";
// const authorsUrl = `${baseUrl}authors/`;
// const searchUrl = `${baseUrl}search/authors.json?q=`;

const favoritesAPI = {
  async getFavoritesByUser(userId: string | undefined): Promise<any> {
    // Fetch author details
    const favoritesResponse = await fetch(`${baseUrl}${userId}`);
    if (!favoritesResponse.ok)
      throw new Error(
        `Failed to fetch favorite details: ${favoritesResponse.status}`
      );
    const favoritesData = await favoritesResponse.json();

    return favoritesData || [];
  },
  async addFavoriteToUser(favorite: Favorite | undefined): Promise<any[]> {
    // Fetch author's works
    const response = await fetch(`${baseUrl}favorites`, {
      method: "post",
      body: JSON.stringify(favorite),
      headers: {
        "Content-Type": "application/json",
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
