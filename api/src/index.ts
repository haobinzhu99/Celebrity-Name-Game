import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg';
import cors from "cors";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

// Health check — confirms the server is running.
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/games/:roomCode", async (req, res) => {
  const game = await prisma.game.findUnique({
    where: { roomCode: req.params.roomCode },
  });

  if (!game) return res.status(404).json({ error: "Game not found" });

  const answer = await prisma.answer.findFirst({
    where: { gameId: game.id },
    orderBy: { createdAt: "desc" },
    select: { celebrity: true },
  });

  res.json(answer?.celebrity ?? null);
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
    // shows the latest celebrity answer
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


app.post("/games", async (req, res) => {
  const { roomCode } = req.body;

  if (!roomCode) {
    return res.status(400).json({ error: "roomCode required" });
  }

  const existing = await prisma.game.findUnique({
    where: { roomCode },
  });

  if (existing) {
    return res.status(409).json({ error: "Game already exists" });
  }

  const game = await prisma.game.create({
    data: {
      roomCode,
    },
  });

  res.status(201).json(game);
});

app.post("/answers", async (req, res) => {
  try {
    const { roomCode, username, answer } = req.body;

    if (!roomCode || !username || !answer) {
      return res.status(400).json({
        error: "Missing roomCode, username, or answer",
      });
    }

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      return res.status(400).json({
        error: "Answer cannot be empty",
      });
    }

    const normalizedAnswer = trimmedAnswer.trim().toLowerCase();

    const parts = normalizedAnswer
      .replace(/[^a-zA-Z\s]/g, "")
      .trim()
      .split(/\s+/);

    const firstName = parts[0];

    const game = await prisma.game.findUnique({
      where: { roomCode },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const previousAnswer = await prisma.answer.findFirst({
      where: { gameId: game.id },
      orderBy: { createdAt: "desc" },
    });

    // prevents the same player twice in a row
    if (previousAnswer?.username === username) {
      return res.status(409).json({
        error: "The same player cannot answer twice in a row",
      });
    }
    if (previousAnswer && previousAnswer.normalizedAnswer === normalizedAnswer){
      return res.status(409).json({ error: "This celebrity has already been used in this game",});
    }

    // determine required letter 
    const source = previousAnswer
      ? previousAnswer.celebrity
      : trimmedAnswer;

    const cleaned = source
      .replace(/[^a-zA-Z\s]/g, "")
      .trim()
      .split(/\s+/);

    const lastWord = cleaned.at(-1) ?? "";
    const requiredLetter = lastWord.charAt(0).toLowerCase();

    //validate first name
    if (firstName.charAt(0) !== requiredLetter) {
      return res.status(400).json({
        error: `Answer must start with "${requiredLetter.toUpperCase()}".`,
      });
    }

    const newAnswer = await prisma.answer.create({
      data: {
        username,
        celebrity: trimmedAnswer,
        normalizedAnswer,
        gameId: game.id,
      },
    });

    return res.status(201).json(newAnswer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});



//Check for unique room
//Create the game + input for first room

// TODO: implement the game routes (see the project spec):
//   POST /games          { roomCode, celebrity }          -> start a game
//   GET  /games/:roomCode                                 -> most recent celebrity name
//   POST /answers        { roomCode, username, answer }   -> submit an answer
//
// To talk to the database, run `yarn prisma:migrate` first (generates the
// client into src/generated/prisma), then wire it up with the pg adapter.
// See this API's README ("Using Prisma in code") for the exact db.ts snippet.