// import { getSession } from "next-auth/react";
import { GetServerSidePropsContext, NextPageContext } from "next";
import { useState } from "react";
import axios from "axios";
import useSwr from "swr";
import fetcher from "@/lib/fetcher";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  console.log("SESSION:", JSON.stringify(session)); // ← add this

  if (!session) return { redirect: { destination: "/auth", permanent: false } };

  const role = (session.user as any)?.role;

  console.log("ROLE:", role); // ← and this

  if (role !== "video_provider" && role !== "super_admin") {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
}
export default function ProviderDashboard() {
  const { data: movies = [], mutate } = useSwr("/api/admin/movies", fetcher);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    genre: "",
    duration: "",
    type: "movie",
    language: "English",
  });

  const handleSubmit = async () => {
    const formData = new FormData();
    if (videoFile) formData.append("video", videoFile);

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / (e.total || 1));
        setUploadProgress(percent);
      },
    });
    mutate();
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
          {["title", "description", "thumbnailUrl", "genre", "duration"].map(
            (key) => (
              <input
                key={key}
                placeholder={key}
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none"
              />
            ),
          )}
          <select
            onChange={(e) =>
              setForm({ ...form, ...({ type: e.target.value } as any) })
            }
            className="bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <select
            onChange={(e) =>
              setForm({ ...form, ...({ language: e.target.value } as any) })
            }
            className="bg-zinc-700 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Korean">Korean</option>
            <option value="Japanese">Japanese</option>
          </select>
          <div className="col-span-2">
            <label className="text-gray-400 text-sm mb-2 block">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="bg-zinc-700 text-white px-4 py-2 rounded-md w-full"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2 bg-zinc-600 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {uploadProgress === 100 && (
              <p className="text-green-400 text-sm mt-2">
                ✓ Upload complete! FFmpeg is processing...
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Upload & Convert
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
