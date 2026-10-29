import makeRequest from "@/utils/makeRequest";

const getArtists = () => makeRequest({ method: "GET", url: "api/artists" });

const getArtistsByCategory = () =>
  makeRequest({ method: "GET", url: "api/artists/by-category" });

const getSongsByArtist = (id: number) =>
  makeRequest({ method: "GET", url: `api/artists/${id}/songs` });

export { getArtists, getSongsByArtist, getArtistsByCategory };
