import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

// Health check — confirms the server is running.
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/games", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      include: {
        answers: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    const result = games.map((game) => ({
      roomCode: game.roomCode,
      latestCelebrity: game.answers[0]?.celebrity || null,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Check for unique room
//Create the game + input for first room

app.post("/games", async (req,res) => {
  const { roomCode, celebrity } = req.body;
  if (!roomCode || !celebrity) {
  return res.status(400).json({
    error: "You must have both a room code and a celebrity",
  });
}

});


// TODO: implement the game routes (see the project spec):
//   POST /games          { roomCode, celebrity }          -> start a game
//   GET  /games/:roomCode                                 -> most recent celebrity name
//   POST /answers        { roomCode, username, answer }   -> submit an answer
//
// To talk to the database, run `yarn prisma:migrate` first (generates the
// client into src/generated/prisma), then wire it up with the pg adapter.
// See this API's README ("Using Prisma in code") for the exact db.ts snippet.

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
