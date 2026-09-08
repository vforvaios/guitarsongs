import makeRequest from "@/utils/makeRequest";

const getCategories = () => {
  return makeRequest({ method: "GET", url: "api/categories" });
};

export { getCategories };
