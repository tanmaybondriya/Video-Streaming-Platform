import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { currentUser } = await serverAuth(req, res);

    if (req.method === "GET") {
      const profiles = await prismadb.profile.findMany({
        where: { userId: currentUser.id },
      });
      return res.status(200).json(profiles);
    }

    if (req.method === "POST") {
      const { name, image } = req.body;
      const profile = await prismadb.profile.create({
        data: {
          userId: currentUser.id,
          name,
          image: image || "/images/default-blue.png",
        },
      });
      return res.status(200).json(profile);
    }

    if (req.method === "DELETE") {
      const { profileId } = req.body;
      await prismadb.profile.delete({ where: { id: profileId } });
      return res.status(200).json({ message: "Profile deleted" });
    }

    if (req.method === "PATCH") {
      const { profileId, name, image } = req.body;
      const updated = await prismadb.profile.update({
        where: { id: profileId },
        data: { name, image },
      });
      return res.status(200).json(updated);
    }
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
