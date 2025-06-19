export class Author {
  key: string = "";
  name: string = "";
  top_work?: string = undefined;
  birth_date: any;
  death_date: any;
  bio: any;
  // Add other properties as needed

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.key) this.key = initializer.key;
    if (initializer.name) this.name = initializer.name;
    if (initializer.top_work) this.top_work = initializer.top_work;
  }
}
