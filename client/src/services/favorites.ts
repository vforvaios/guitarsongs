import makeRequest from "@/utils/makeRequest";

const getFavorites = () => makeRequest({ method: "GET", url: "api/favorites" });

const addFavorite = async (songId: number) =>
  makeRequest({ method: "POST", url: `api/favorites/${songId}` });

const removeFavorite = async (songId: number) =>
  makeRequest({ method: "DELETE", url: `api/favorites/${songId}` });

export { getFavorites, addFavorite, removeFavorite };
