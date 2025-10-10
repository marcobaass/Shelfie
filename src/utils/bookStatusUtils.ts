import { Book } from "../redux/books/bookTypes";

export type StatusType = 'wishlist' | 'reading' | 'finished';

export function updateBookStatus(
  book: Book,
  status: StatusType,
  wishlist: Book[],
  reading: Book[],
  finished: Book[],
) {
  const isOnList = (list: Book[]) => list.some(b => b.id === book.id);
  const updateList = (list: Book[], add: boolean) => add ? [...list, book] : list.filter(b => b.id !== book.id);

  let newWishlist = wishlist;
  let newReading = reading;
  let newFinished = finished;

  switch (status) {
    case 'wishlist':
      newWishlist = updateList(wishlist, !isOnList(wishlist));
      newReading = updateList(reading, false);
      newFinished = updateList(finished, false);
      break;
    case 'reading':
      newWishlist = updateList(wishlist, false);
      newReading = updateList(reading, !isOnList(reading));
      newFinished = updateList(finished, false);
      break;
    case 'finished':
      newWishlist = updateList(wishlist, false);
      newReading = updateList(reading, false);
      newFinished = updateList(finished, !isOnList(finished));
      break;
  }

  return {
    wishlist: newWishlist,
    reading: newReading,
    finished: newFinished
  };
}
