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
  console.time("fetchTopScores");
  try {
    const redisData = await getTopScores();
    if (redisData && !force) {
      console.log("redisData used...");
      console.timeEnd("fetchTopScores");
      return redisData;
    } else {
      console.log("supaBase data used...");
      console.time("supabaseget20");
      console.time("");
      const { data, error } = await supabase
        .from("completedGames")
        .select("*")
        .order("score", { ascending: false })
        .limit(20);

      if (error) throw new Error("Eroror fetching top score from supabase");

      const jsonData = JSON.stringify(data);
      await redisClient.set("topscores", jsonData);
      console.timeEnd("supabaseget20");
      return data;
    }
  } catch (error) {
    console.warn(error);
  }
}
