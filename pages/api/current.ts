import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Not signed in" });
    }

    const currentUser = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(currentUser);
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
