import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getSession({ req });

    if (!session?.user?.email) {
      return res.status(401).json({ error: "Not signed in" });
    }

    const currentUser = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(currentUser);
  } catch (err) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
