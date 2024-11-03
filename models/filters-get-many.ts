export class FiltersGetMany {
  public start: number = 0;
  public end: number = 10;
  public sort: string = 'id';
  public order: 'asc' | 'desc' = 'asc';

  constructor(
    start: number = 0,
    end: number = 10,
    sort: string = 'id',
    order: 'asc' | 'desc' = 'asc',
    sortPossibleValues: string[] = ['id'],
    sortFallbackValue: string = 'id',
  ) {
    this.start = +start;
    this.end = +end;
    this.sort = sort;
    this.order = order;

    if (!sortPossibleValues.includes(sort)) {
      this.sort = sortFallbackValue;
    }
  }
}
