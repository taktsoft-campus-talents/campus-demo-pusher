import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
});

const PORT = process.env.PORT || 3000;

const app = express();
app.use(json());
app.use(cors());

app.get("/", (_, res) => {
  return res.json({ msg: "API is running" });
});

app.post("/news", (req, res) => {
  const note = req.body;
  const date = new Date();
  pusher.trigger("news", "new-news", {
    ...note,
    timestamp: date.toISOString(),
  });
  return res.json({ msg: "news added" });
});

app.listen(PORT, () => {
  console.log("pusher service started on port", PORT);
});
