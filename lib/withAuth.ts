import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function requireAuth(
  context: GetServerSidePropsContext,
  role?: string,
) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth", permanent: false } };
  }

  if (role && (session.user as any)?.role !== role) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return null;
}
