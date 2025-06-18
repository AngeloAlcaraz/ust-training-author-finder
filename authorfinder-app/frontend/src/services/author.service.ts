import type { Author } from "../model/Author";

const baseUrl = "https://openlibrary.org/";
// const authorsUrl = `${baseUrl}authors`;
const searchUrl = `${baseUrl}search/authors.json?q=`;

const authorAPI = {
  async getAuthorById(authorId: string): Promise<any> {
    // Fetch author details
    const authorResponse = await fetch(`${baseUrl}${authorId}.json`);
    if (!authorResponse.ok)
      throw new Error(
        `Failed to fetch author details: ${authorResponse.status}`
      );
    const authorData = await authorResponse.json();
    console.log("Author Data:", authorData);

    // Fetch author's works
    const worksResponse = await fetch(`${baseUrl}${authorId}/works.json`);

    if (!worksResponse.ok)
      throw new Error(`Failed to fetch author works: ${worksResponse.status}`);
    const worksData = await worksResponse.json();

    return worksData.entries || [];
  },

  async getAuthorsByName(name: string): Promise<Author[]> {
    const response = await fetch(`${searchUrl}${name}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Search Results:", data.docs);

    return data.docs;
  },
};

export default authorAPI;
