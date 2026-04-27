import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await serverAuth(req, res);

    const { type, language, sortBy } = req.query;

    const movies = await prismadb.movie.findMany({
      where: {
        ...(type ? { type: type as string } : {}),
        ...(language ? { language: language as string } : {}),
      },
      orderBy: sortBy === "latest" ? { releaseYear: "desc" } : undefined,
    });

    return res.status(200).json(movies);
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
