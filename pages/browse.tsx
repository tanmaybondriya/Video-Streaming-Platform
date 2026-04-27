import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import Navbar from "@/component/Navbar";
import MovieList from "@/component/MovieList";
import InfoModal from "@/component/InfoModal";
import useMovieList from "@/hooks/useMovieList";
import useInfoModal from "@/hooks/useInfoModal";

const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "Korean",
  "Japanese",
  "Italian",
];

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/auth", permanent: false } };
  return { props: {} };
}

export default function BrowseByLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { data: movies = [] } = useMovieList({ language: selectedLanguage });
  const { isOpen, closeModal } = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-32 pb-40 bg-zinc-900 min-h-screen px-4 md:px-12">
        <h1 className="text-white text-3xl font-bold mb-8">
          Browse by Language
        </h1>
        <div className="flex flex-row gap-3 flex-wrap mb-10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                selectedLanguage === lang
                  ? "bg-red-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
        <MovieList
          title={`${selectedLanguage} Movies & Series`}
          data={movies}
        />
      </div>
    </>
  );
}
