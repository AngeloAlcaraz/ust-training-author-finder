export class Favorite {
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
  }
}
