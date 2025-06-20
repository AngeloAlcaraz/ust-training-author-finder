import type { Author } from "./Author";

export class Favorite {
  author: Author;
  authorId: string;
  name: string;
  imageUrl: string;
  birthDate: string;
  deathDate: string;
  topWork: string;
  addedBy: string;
  addedAt: string;

  constructor(initializer: any) {
    this.authorId = initializer.authorId ?? "";
    this.name = initializer.name ?? "";
    this.imageUrl = initializer.imageUrl ?? "";
    this.birthDate = initializer.birthDate ?? "";
    this.deathDate = initializer.deathDate ?? "";
    this.topWork = initializer.topWork ?? "";
    this.addedBy = initializer.addedBy ?? "";
    this.addedAt = initializer.addedAt ?? "";

    this.author = {
      key: this.authorId,
      name: this.name,
      top_work: this.topWork,
      birth_date: this.birthDate,
      death_date: this.deathDate,
      bio: "",
    };
  }
}
