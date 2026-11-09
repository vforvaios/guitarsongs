import makeRequest from "@/utils/makeRequest";

const getArtists = () => makeRequest({ method: "GET", url: "api/artists" });
const createArtist = ({ name, token }: any) =>
  makeRequest({
    method: "POST",
    url: "api/artists",
    body: JSON.stringify({ name }),
    token,
  });

const getArtistsByCategory = () =>
  makeRequest({ method: "GET", url: "api/artists/by-category" });

const getSongsByArtist = (id: number) =>
  makeRequest({ method: "GET", url: `api/artists/${id}/songs` });

const updateArtist = ({ id, name, token }: any) => {
  return makeRequest({
    method: "PUT",
    url: `api/artists/${id}`,
    body: JSON.stringify({ name }),
    token,
  });
};

const deleteArtist = ({ id, token }: any) => {
  return makeRequest({
    method: "DELETE",
    url: `api/artists/${id}`,
    token,
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
