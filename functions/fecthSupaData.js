import supabase from "../services/SupabaseService";
import redisClient from "../services/RedisConn";
async function getTopScores() {
  try {
    const data = await redisClient.get("topscores").then((data) => {
      return JSON.parse(data);
    });
    if (!data) return false;
    return data;
  } catch (error) {
    console.warn("someting wrong with redis getter func");
  }
}

export default async function fetchTopScores(force = false) {
  try {
    const redisData = await getTopScores();
    if (redisData && !force) {
      return redisData;
    } else {
      const { data, error } = await supabase
        .from("completedGames")
        .select("*")
        .order("score", { ascending: false })
        .limit(20);

      if (error) throw new Error("Eroror fetching top score from supabase");

      const jsonData = JSON.stringify(data);
      await redisClient.set("topscores", jsonData);
      return data;
    }
  } catch (error) {
    console.warn(error);
  }
}
