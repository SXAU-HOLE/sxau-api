import express from "express";
import { setupServer } from "./src/server";

const app = express();
app.use(express.json());

const port = 8080;

async function start() {
  app.get("/", (req, res) => {
    res.send({
      msg: "success",
    });
  });

  await setupServer(app);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

start();
