import makeRequest from "@/utils/makeRequest";

const getSongsByCategory = (categoryId: number) => {
  return makeRequest({ method: "GET", url: `api/songs/${categoryId}` });
};
const getSongById = (id: number) => {
  return makeRequest({ method: "GET", url: `api/song/${id}` });
};

export { getSongsByCategory, getSongById };
