import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    if (req.method === "POST") {
      const { movieId } = req.body;

      const existingMovie = await prismadb.movie.findUnique({
        where: { id: movieId },
      });

      if (!existingMovie) {
        throw new Error("Invalid movie ID");
      }

      const updatedUser = await prismadb.user.update({
        where: { id: currentUser.id },
        data: {
          favoriteIds: { push: movieId },
        },
      });

      return res.status(200).json(updatedUser);
    }

    if (req.method === "DELETE") {
      const { movieId } = req.body;

      const updatedFavoriteIds = currentUser.favoriteIds.filter(
        (id) => id !== movieId,
      );

      const updatedUser = await prismadb.user.update({
        where: { id: currentUser.id },
        data: {
          favoriteIds: updatedFavoriteIds,
        },
      });

      return res.status(200).json(updatedUser);
    }

    if (req.method === "GET") {
      const favoriteMovies = await prismadb.movie.findMany({
        where: { id: { in: currentUser.favoriteIds } },
      });

      return res.status(200).json(favoriteMovies);
    }
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
