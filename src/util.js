import axios from "axios";
const API_BASE_URL = "https://evxoorqk27.execute-api.ap-south-1.amazonaws.com/dev/goodreadshello";
const API_REVIEW = "https://evxoorqk27.execute-api.ap-south-1.amazonaws.com/dev/getbooksreview";

export const getDataFromAPI = (searchString, page = 1) => {
  return axios.get(API_BASE_URL, {
    params: {
      q: searchString,
      page
    }
  });
};

export const getReviewDataFromAPI = id => {
  return axios.get(API_REVIEW, {
    params: {
      id
    }
  });
};

export const formatData = data => {
  let { results, ...otherprops } = data;
  if (typeof results == "string") {
    results = {};
  }
  const { work: books = [] } = results;
  const flattned = books.map(book => {
    const { best_book = {} } = book;
    const { author = {} } = best_book;
    const final = {
      ...book,
      ...author,
      ...best_book
    };
    return final;
  });
  return {
    queryDetails: otherprops,
    books: flattned
  };
};
