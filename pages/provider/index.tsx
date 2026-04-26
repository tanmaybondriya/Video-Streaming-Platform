import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useState } from "react";
import axios from "axios";
import useSwr from "swr";
import fetcher from "@/lib/fetcher";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: "/auth", permanent: false } };
  if (
    !["video_provider", "super_admin"].includes((session.user as any)?.role)
  ) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

export default function ProviderDashboard() {
  const { data: movies = [], mutate } = useSwr("/api/admin/movies", fetcher);
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    genre: "",
    duration: "",
  });

  const handleSubmit = async () => {
    await axios.post("/api/admin/movies", form);
    mutate();
    setForm({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      genre: "",
      duration: "",
    });
  };

  const handleDelete = async (movieId: string) => {
    await axios.delete("/api/admin/movies", { data: { movieId } });
    mutate();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Video Provider Dashboard</h1>

      {/* Upload Form */}
      <div className="bg-zinc-800 p-6 rounded-md mb-10">
        <h2 className="text-2xl font-semibold mb-4">Upload Movie</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Upload
        </button>
      </div>

      {/* Movies Table */}
      <h2 className="text-2xl font-semibold mb-4">Your Movies</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="pb-4">Title</th>
            <th className="pb-4">Genre</th>
            <th className="pb-4">Duration</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie: any) => (
            <tr key={movie.id} className="border-b border-gray-800">
              <td className="py-4">{movie.title}</td>
              <td className="py-4">{movie.genre}</td>
              <td className="py-4">{movie.duration}</td>
              <td className="py-4">
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
