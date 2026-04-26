import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { NextPageContext } from "next";
import Navbar from "@/component/Navbar";
import Billboard from "@/component/Billboard";
import MovieList from "@/component/MovieList";
import InfoModal from "@/component/InfoModal";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import useInfoModal from "@/hooks/useInfoModal";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getServerSession(
    context.req as any,
    context.res as any,
    authOptions,
  );

  if (!session) {
    return { redirect: { destination: "/auth", permanent: false } };
  }

  return { props: {} };
}

export default function Home() {
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  );
}
