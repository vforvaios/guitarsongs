import makeRequest from "@/utils/makeRequest";

const getArtists = () => makeRequest({ method: "GET", url: "api/artists" });
const createArtist = (name: string) =>
  makeRequest({
    method: "POST",
    url: "api/artists",
    body: JSON.stringify({ name }),
  });

const getArtistsByCategory = () =>
  makeRequest({ method: "GET", url: "api/artists/by-category" });

const getSongsByArtist = (id: number) =>
  makeRequest({ method: "GET", url: `api/artists/${id}/songs` });

const updateArtist = (id: number, name: string) => {
  return makeRequest({
    method: "PUT",
    url: `api/artists/${id}`,
    body: JSON.stringify({ name }),
  });
};

const deleteArtist = (id: number) => {
  return makeRequest({
    method: "DELETE",
    url: `api/artists/${id}`,
  });
};

export {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  getSongsByArtist,
  getArtistsByCategory,
};
