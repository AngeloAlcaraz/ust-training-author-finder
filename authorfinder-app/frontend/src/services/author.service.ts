import type { Author } from "../model/Author";

const baseUrl = "https://openlibrary.org/";
const authorsUrl = `${baseUrl}authors/`;
const searchUrl = `${baseUrl}search/authors.json?q=`;

const authorAPI = {
  async getAuthorById(authorId: string | undefined): Promise<any> {
    // Fetch author details
    const authorResponse = await fetch(`${authorsUrl}${authorId}.json`);
    if (!authorResponse.ok)
      throw new Error(
        `Failed to fetch author details: ${authorResponse.status}`
      );
    const authorData = await authorResponse.json();

    return authorData || [];
  },
  async getAuthorWorksById(authorId: string | undefined): Promise<any[]> {
    // Fetch author's works
    const worksResponse = await fetch(`${authorsUrl}${authorId}/works.json`);
    if (!worksResponse.ok) {
      throw new Error(
        `Failed to fetch works for author ${authorId}: ${worksResponse.status}`
      );
    }
    const data = await worksResponse.json();
    console.log("Works Data:", data.entries);

    return data.entries || [];
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
