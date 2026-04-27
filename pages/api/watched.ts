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

    if (!profileId || typeof profileId !== "string") {
      return res.status(400).json({ error: "Profile ID required" });
    }

    const profile = await prismadb.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) return res.status(404).json({ error: "Profile not found" });

    if (req.method === "GET") {
      // get last 10 watched movies in reverse order
      const watchedMovies = await prismadb.movie.findMany({
        where: { id: { in: profile.watchedIds } },
      });

      // sort by watchedIds order (most recent first)
      const sorted = profile.watchedIds
        .slice()
        .reverse()
        .map((id) => watchedMovies.find((m) => m.id === id))
        .filter(Boolean)
        .slice(0, 10);

      return res.status(200).json(sorted);
    }

    if (req.method === "POST") {
      const { movieId, progress } = req.body;

      const filteredIds = profile.watchedIds.filter((id) => id !== movieId);
      const updatedIds = [...filteredIds, movieId].slice(-20);

      await prismadb.profile.update({
        where: { id: profileId },
        data: { watchedIds: updatedIds },
      });

      // save progress in localStorage key via response
      return res.status(200).json({ success: true, progress });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Something went wrong" });
  }
}
