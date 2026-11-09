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

const createSong = async (payload: any) => {
  return makeRequest({
    method: "POST",
    url: `api/songs`,
    body: JSON.stringify(payload),
  });
};

const getAdminSongs = async () => {
  return makeRequest({
    method: "GET",
    url: `api/songs/admin`,
  });
};

const deleteSong = (id: number) => {
  return makeRequest({
    method: "DELETE",
    url: `api/songs/${id}`,
  });
};

const updateSong = (id: number, payload: any) => {
  return makeRequest({
    method: "PUT",
    url: `api/song/${id}`,
    body: JSON.stringify(payload),
  });
};

export {
  getAdminSongs,
  deleteSong,
  getSongsByCategory,
  getSongById,
  searchSongs,
  createSong,
  updateSong,
};
