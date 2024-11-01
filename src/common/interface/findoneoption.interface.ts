interface FindOneOptions {
  relations?: string[] | string;
  withDeleted?: boolean;
  select?: string[] | string;
  onlyDeleted?: boolean;
  findOrThrow?: boolean;
}
export default FindOneOptions;