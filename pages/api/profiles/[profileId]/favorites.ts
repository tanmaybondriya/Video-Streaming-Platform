import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await serverAuth(req, res);
    const { profileId } = req.query;

    if (typeof profileId !== "string") throw new Error("Invalid profile ID");

    const profile = await prismadb.profile.findUnique({
      where: { id: profileId },
    });
    if (!profile) throw new Error("Profile not found");

    if (req.method === "GET") {
      const movies = await prismadb.movie.findMany({
        where: { id: { in: profile.favoriteIds } },
      });
      return res.status(200).json(movies);
    }

    if (req.method === "POST") {
      const { movieId } = req.body;
      const updated = await prismadb.profile.update({
        where: { id: profileId },
        data: { favoriteIds: { push: movieId } },
      });
      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      const { movieId } = req.body;
      const updated = await prismadb.profile.update({
        where: { id: profileId },
        data: {
          favoriteIds: profile.favoriteIds.filter((id) => id !== movieId),
        },
      });
      return res.status(200).json(updated);
    }
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
