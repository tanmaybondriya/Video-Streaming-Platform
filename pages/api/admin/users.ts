import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    if (
      currentUser.role !== "super_admin" &&
      currentUser.role !== "video_provider"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "GET") {
      const movies =
        currentUser.role === "super_admin"
          ? await prismadb.movie.findMany()
          : await prismadb.movie.findMany({
              where: { uploadedBy: currentUser.id },
            });
      return res.status(200).json(movies);
    }

    if (req.method === "POST") {
      const { title, description, videoUrl, thumbnailUrl, genre, duration } =
        req.body;
      const movie = await prismadb.movie.create({
        data: {
          title,
          description,
          videoUrl,
          thumbnailUrl,
          genre,
          duration,
          uploadedBy: currentUser.id,
        },
      });
      return res.status(200).json(movie);
    }

    if (req.method === "DELETE") {
      const { movieId } = req.body;
      await prismadb.movie.delete({ where: { id: movieId } });
      return res.status(200).json({ message: "Movie deleted" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
