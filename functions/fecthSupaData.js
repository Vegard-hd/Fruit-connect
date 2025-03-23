import CompletedGamesService from "../services/MongoClient";

const completedGamesService = new CompletedGamesService();

async function getTopScores() {
  try {
    const data = await completedGamesService.getTop10().then((data) => {
      console.log("topscores from getTopScores mongo method", data);
      return data ?? [];
    });
    if (!data || data?.length === 0) return false;
    return data;
  } catch (error) {
    console.warn("Failed to get topscores from mongodb");
  }
}

export default async function fetchTopScores(force = false) {
  try {
    const data = await getTopScores();
    return data;
  } catch (error) {
    console.warn(error);
  }
}
