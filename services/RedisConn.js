import { createClient } from "redis";

const redisClient = await createClient({ url: "redis://redis:6379" })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default redisClient;
// await client.set("key", "value");
// const value = await client.get("key");
// await client.disconnect();
