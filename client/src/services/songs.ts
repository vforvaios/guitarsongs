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

const createSong = async ({ payload, token }: any) => {
  return makeRequest({
    method: "POST",
    url: `api/songs`,
    body: JSON.stringify(payload),
    token,
  });
};

const getAdminSongs = async () => {
  return makeRequest({
    method: "GET",
    url: `api/songs/admin`,
  });
};

const deleteSong = ({ id, token }: any) => {
  return makeRequest({
    method: "DELETE",
    url: `api/songs/${id}`,
    token,
  });
};

const updateSong = ({ id, payload, token }: any) => {
  return makeRequest({
    method: "PUT",
    url: `api/song/${id}`,
    body: JSON.stringify(payload),
    token,
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
