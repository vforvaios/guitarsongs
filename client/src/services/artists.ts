import makeRequest from "@/utils/makeRequest";

const getArtists = () => makeRequest({ method: "GET", url: "api/artists" });
const getSongsByArtist = (id: number) =>
  makeRequest({ method: "GET", url: `api/artists/${id}/songs` });

export { getArtists, getSongsByArtist };
