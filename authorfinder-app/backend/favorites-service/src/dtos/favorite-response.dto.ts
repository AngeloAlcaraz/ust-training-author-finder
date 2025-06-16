import { Expose } from 'class-transformer';

export class FavoriteResponseDto {
  @Expose()
  _id: string;

  @Expose()
  authorId: string;

  @Expose()
  name: string;

  @Expose()
  alternateNames: string[];

  @Expose()
  birthDate: string;

  @Expose()
  deathDate: string;

  @Expose()
  topWork: string;

  @Expose()
  topSubjects: string[];

  @Expose()
  workCount: number;

  @Expose()
  ratingsAverage: number;

  @Expose()
  ratingsCount: number;

  @Expose()
  addedBy: string;

  @Expose()
  addedAt: string;
}
