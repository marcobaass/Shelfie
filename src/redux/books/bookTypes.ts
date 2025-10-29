// export interface Search and Suggestions
export interface Book {
  id: string;
  title: string;
  author_name?: string[];
  cover?: number;
  year?: number;
  synopsis?: string;
  number_of_pages?: number;
  authors?: string[];

}

// BookDetails
export interface RawApiDoc {
  key?: string;
  id?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  cover?: number;
  covers?: string[];
  first_publish_year?: number;
  year?: number;
  synopsis?: string;
  number_of_pages?: number;
  description?: string;
  subjects?: string[];
  authors?: Array<{
    author: {
      key: string;
    };
    type?: {
      key: string;
    };
  }>;
}

// BookEditions
// This is the interface representing a single book edition object.
export interface RawEditionApiDoc {
  publishers?: string[];
  number_of_pages?: number;
  table_of_contents?: TableOfContentsEntry[];
  covers?: number[];
  lc_classifications?: string[];
  latest_revision?: number;
  key?: string; // The unique key for this edition.
  authors?: AuthorReference[];
  ocaid?: string;
  publish_places?: string[];
  isbn_13?: string[];
  pagination?: string;
  source_records?: string[];
  subtitle?: string;
  title?: string;
  lccn?: string[];
  notes?: string;
  identifiers?: Record<string, string[]>;
  created?: DateTime;
  languages?: LanguageReference[];
  dewey_decimal_class?: string[];
  last_modified?: DateTime;
  physical_format?: string;
  publish_date?: string;
  publish_country?: string;
  by_statement?: string;
  oclc_numbers?: string[];
  works?: WorkReference[];
  type?: { key: string };
  revision?: number;
  description: string;
}

// Sub-interfaces for the nested data.
interface TableOfContentsEntry {
  level: number;
  label: string;
  title: string;
  pagenum?: string;
}

interface AuthorReference {
  key: string; // The unique key for the author.
}

interface LanguageReference {
  key: string; // The unique key for the language (e.g., /languages/eng).
}

interface WorkReference {
  key: string; // The unique key for the related work.
}

interface DateTime {
  type: string;
  value: string;
}

// type for the fetched Author Data
export interface AuthorApiDoc {
  docs: AuthorApiDoc[];
  name: string;
  key: string;
  bio?: string | { type: string; value: string };
  birth_date?: string;
  death_date?: string;
  alternate_names?: string[];
  photos?: number[];
  links?: Array<{
    url: string;
    title: string;
    type: { key: string };
  }>;
}

// Types for Authors Works
export interface AuthorWorksResponse {
  links: {
    self: string;
    author: string;
    next?: string;
  };
  size: number;
  entries: AuthorWorkEntry[];
}

export interface AuthorWorkEntry {
  type: {
    key: string;
  };
  title: string;
  authors: Array<{
    type: {
      key: string;
    };
    author: {
      key: string;
    };
  }>;
  key: string;
  latest_revision?: number;
  revision?: number;
  created?: {
    type: string;
    value: string;
  };
  covers?: number[];
  first_publish_year: number;
}
