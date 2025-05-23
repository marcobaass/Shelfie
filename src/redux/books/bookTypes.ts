export interface Book {
  id: string;
  title: string;
  author_name?: string[];
  cover?: number;
  year?: number;
  synopsis?: string;
}

export interface RawApiDoc {
  key?: string;
  id?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  cover?: number;
  first_publish_year?: number;
  year?: number;
  synopsis?: string;
}
