import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useSwr from "swr";
import fetcher from "@/lib/fetcher";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { AiOutlineDelete } from "react-icons/ai";
import { BsUpload } from "react-icons/bs";
import Navbar from "@/component/Navbar";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/auth", permanent: false } };
  const role = (session.user as any)?.role;
  if (role !== "video_provider" && role !== "super_admin") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { data: movies = [], mutate } = useSwr("/api/admin/movies", fetcher);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
    if (!videoFile) return alert("Please select a video file");
    if (!form.title || !form.description || !form.genre || !form.duration) {
      return alert("Please fill all fields");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", videoFile);
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 1));
          setUploadProgress(percent);
        },
      });
      mutate();
      setShowForm(false);
      setVideoFile(null);
      setUploadProgress(0);
      setForm({
        title: "",
        description: "",
        thumbnailUrl: "",
        genre: "",
        duration: "",
        type: "movie",
        language: "English",
      });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (movieId: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    await axios.delete("/api/admin/movies", { data: { movieId } });
    mutate();
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar />
      <div className="pt-24 px-4 md:px-12 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-bold">
            Provider Dashboard
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            <BsUpload size={16} />
            Upload Movie
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <div className="bg-zinc-800 p-6 rounded-md mb-10 border border-zinc-700">
            <h2 className="text-white text-2xl font-semibold mb-6">
              Upload New Movie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                placeholder="Thumbnail URL"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm({ ...form, thumbnailUrl: e.target.value })
                }
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 md:col-span-2 resize-none h-24"
              />
              <input
                placeholder="Genre (e.g. Drama, Action)"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <input
                placeholder="Duration (e.g. 142 min)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="bg-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Korean">Korean</option>
                <option value="Japanese">Japanese</option>
              </select>

              {/* Video Upload */}
              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-2 block">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="bg-zinc-700 text-white px-4 py-3 rounded-md w-full focus:outline-none cursor-pointer"
                />
                {videoFile && (
                  <p className="text-gray-400 text-sm mt-2">
                    Selected: {videoFile.name} (
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="bg-zinc-600 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {uploadProgress === 100 && isUploading && (
                  <p className="text-yellow-400 text-sm mt-2">
                    ⏳ FFmpeg is converting to 480p, 720p, 1080p...
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <BsUpload size={16} />
                {isUploading ? "Uploading..." : "Upload & Convert"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-zinc-700 text-white px-6 py-2 rounded-md hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        <h2 className="text-white text-2xl font-semibold mb-6">
          Your Movies ({movies.length})
        </h2>

        {movies.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No movies uploaded yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
            >
              Upload your first movie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie: any) => (
              <div
                key={movie.id}
                className="bg-zinc-800 rounded-md overflow-hidden border border-zinc-700 hover:border-zinc-500 transition group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  {movie.thumbnailUrl ? (
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                      <span className="text-gray-400">No thumbnail</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      onClick={() => router.push(`/watch/${movie.id}`)}
                      className="bg-white text-black px-3 py-1 rounded text-sm font-semibold hover:bg-gray-200 transition"
                    >
                      ▶ Play
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg truncate mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate mb-2">
                    {movie.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
                    <span className="bg-zinc-700 px-2 py-1 rounded">
                      {movie.genre}
                    </span>
                    <span className="bg-zinc-700 px-2 py-1 rounded">
                      {movie.duration}
                    </span>
                    <span className="bg-zinc-700 px-2 py-1 rounded">
                      {movie.language}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${movie.type === "series" ? "bg-blue-900 text-blue-300" : "bg-red-900 text-red-300"}`}
                    >
                      {movie.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span
                      className={`px-2 py-1 rounded ${movie.video720p ? "bg-green-900 text-green-300" : "bg-zinc-700"}`}
                    >
                      {movie.video720p ? "✓ 720p" : "✗ 720p"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${movie.video1080p ? "bg-green-900 text-green-300" : "bg-zinc-700"}`}
                    >
                      {movie.video1080p ? "✓ 1080p" : "✗ 1080p"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${movie.video480p ? "bg-green-900 text-green-300" : "bg-zinc-700"}`}
                    >
                      {movie.video480p ? "✓ 480p" : "✗ 480p"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm transition"
                  >
                    <AiOutlineDelete size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
