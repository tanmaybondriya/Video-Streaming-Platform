import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import Navbar from "@/component/Navbar";
import MovieList from "@/component/MovieList";
import InfoModal from "@/component/InfoModal";
import useMovieList from "@/hooks/useMovieList";
import useInfoModal from "@/hooks/useInfoModal";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/auth", permanent: false } };
  return { props: {} };
}

export default function NewAndPopular() {
  const { data: movies = [] } = useMovieList({ sortBy: "latest" });
  const { isOpen, closeModal } = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-32 pb-40 bg-zinc-900 min-h-screen">
        <MovieList title="New & Popular" data={movies} />
      </div>
    </>
  );
}
