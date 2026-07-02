import "dotenv/config";
import express from "express";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
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


app.post("/games", async (req, res) => {
  const { roomCode } = req.body;

  if (!roomCode) {
    return res.status(400).json({
      error: "Room code is required",
    });
  }

  try {
    const game = await prisma.game.create({
      data: {
        roomCode,
      },
    });

    return res.status(201).json(game);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create game",
    });
  }
});

app.post("/answers", async (req, res) => {
  try {
    const { gameId, username, answer } = req.body;

    if (!gameId || !username || !answer) {
      return res.status(400).json({
        error: "Error! There is a missing field",
      });
    }

    //remove leading and ending white space
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      return res.status(400).json({
        error: "Answer cannot be empty",
      });
    }

    // Normalize the current answer for validation
    const normalizedAnswer = trimmedAnswer.toLowerCase();
    const parts = normalizedAnswer.split(/\s+/);
    const firstName = parts[0];

    const previousAnswer = await prisma.answer.findFirst({
      where: {
        gameId: Number(gameId),
      },
      orderBy: {
        id: "desc",
      },
    });

    // Prevent the same player from answering twice in a row
    if (previousAnswer?.username === username) {
      return res.status(409).json({
        error: "The same player cannot answer twice in a row",
      });
    }

    if (previousAnswer) {
      // Normalize the previous celebrity name
      const previousParts = previousAnswer.celebrity
        .trim()
        .toLowerCase()
        .split(/\s+/);

    
      const previousLastName = previousParts[previousParts.length - 1];
      const requiredLetter = previousLastName.charAt(0);

      if (firstName.charAt(0) !== requiredLetter) {
        return res.status(400).json({
          error: `Answer must start with "${requiredLetter.toUpperCase()}".`,
        });
      }
    }

    const newAnswer = await prisma.answer.create({
      data: {
        username,
        celebrity: trimmedAnswer,
        gameId: Number(gameId),
      },
    });

    return res.status(201).json(newAnswer);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
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