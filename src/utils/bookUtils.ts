import { Book, RawApiDoc } from '../../src/redux/books/bookTypes';

export function mapRawDocToBook(rawDoc: RawApiDoc): Book | null {
  const idSource = rawDoc.key ?? rawDoc.id;
  const title = rawDoc.title;

  if(!idSource || !title) {
    return null;
  }

  const idSourceString = String(idSource);
  const finalId = idSourceString.includes('/')
                  ? idSourceString.split('/').pop() || ''
                  : idSourceString;

  if(!finalId) return null

  const formattedBook: Book = {
    id: finalId,
    title: title,
    author_name: rawDoc.author_name || [],
    cover: rawDoc.cover ?? rawDoc.cover_i,
    year: rawDoc.year ?? rawDoc.first_publish_year,
    synopsis: rawDoc.synopsis
  };

  return formattedBook
}
