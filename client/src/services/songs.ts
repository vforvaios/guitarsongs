import makeRequest from "@/utils/makeRequest";

const getSongsByCategory = (categoryId: number) => {
  return makeRequest({ method: "GET", url: `api/songs/${categoryId}` });
};
const getSongById = (id: number) => {
  return makeRequest({ method: "GET", url: `api/song/${id}` });
};

const searchSongs = async (body: string) => {
  return makeRequest({
    method: "POST",
    url: `api/songs/search`,
    body: JSON.stringify({ search: body }),
  });
};

export { getSongsByCategory, getSongById, searchSongs };
