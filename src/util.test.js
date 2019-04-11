import { formatData, getDataFromAPI, getReviewDataFromAPI } from "./util";
const searchString = "Harry Potter";
const page = 1;
const bookId = "5";
describe("Testing Async backend calls getDataFromAPI", () => {
  jest.setTimeout(20000);
  let searchAPIResponse = {};
  beforeAll(async () => {
    try {
      const response = await getDataFromAPI(searchString, page);
      searchAPIResponse = formatData(response.data);
    } catch (e) {
      throw Error(e.message);
    }
  });

  it("getDataFromAPI => should return query details", () => {
    const { queryDetails } = searchAPIResponse;
    expect(queryDetails).toEqual(
      expect.objectContaining({
        query: searchString,
        "results-end": "18",
        "results-start": "1",
        source: "Goodreads",
        "query-time-seconds": expect.anything(),
        "total-results": expect.anything()
      })
    );
  });

  it("getDataFromAPI => should return books list", () => {
    const { books } = searchAPIResponse;
    expect(books).toHaveLength(18);
    books.forEach(book => {
      expect(book).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          author: expect.anything(),
          best_book: expect.anything(),
          average_rating: expect.any(String),
          books_count: expect.any(String),
          image_url: expect.stringMatching(/jpg|png|jpeg/),
          small_image_url: expect.stringMatching(/jpg|png|jpeg/),
          name: expect.any(String),
          original_publication_day: expect.any(String),
          original_publication_month: expect.any(String),
          original_publication_year: expect.any(String),
          ratings_count: expect.any(String),
          text_reviews_count: expect.any(String),
          title: expect.any(String)
        })
      );
    });
  });
});

describe("Testing Async backend calls getReviewDataFromAPI", () => {
  jest.setTimeout(20000);
  let reviewAPIResponse = {};
  beforeAll(async () => {
    try {
      const response = await getReviewDataFromAPI(bookId);
      reviewAPIResponse = response.data;
    } catch (e) {
      throw Error(e.message);
    }
  });

  it("getDataFromAPI => should return query details", () => {
    expect(reviewAPIResponse.book).toEqual(
      expect.objectContaining({
        id: bookId,
        title: expect.any(String),
        isbn: expect.any(String),
        isbn13: expect.any(String),
        asin: expect.any(String),
        kindle_asin: expect.any(String),
        marketplace_id: expect.any(String),
        country_code: expect.any(String),
        image_url: expect.any(String),
        small_image_url: expect.any(String),
        publication_year: expect.any(String),
        publication_month: expect.any(String),
        publication_day: expect.any(String),
        publisher: expect.any(String),
        language_code: expect.any(String),
        is_ebook: expect.any(String),
        description: expect.any(String),
        work: expect.anything(),
        average_rating: expect.any(String),
        num_pages: expect.any(String),
        format: expect.any(String),
        edition_information: expect.any(String),
        ratings_count: expect.any(String),
        text_reviews_count: expect.any(String),
        url: expect.any(String),
        link: expect.any(String),
        authors: expect.anything(),
        reviews_widget: expect.anything(),
        popular_shelves: expect.anything(),
        book_links: expect.anything(),
        buy_links: expect.anything()
      })
    );
  });
});
