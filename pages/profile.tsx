import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import useProfiles from "@/hooks/useProfiles";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";

const AVATAR_OPTIONS = [
  "/images/default-blue.png",
  "/images/default-profile-red.webp",
];

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/auth", permanent: false } };
  return { props: {} };
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: profiles = [], mutate } = useProfiles();
  const { setCurrentProfile } = useCurrentProfile();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(AVATAR_OPTIONS[0]);

  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [editName, setEditName] = useState("");

  const handleSelectProfile = (profile: any) => {
    setCurrentProfile(profile);
    router.push("/");
  };

  const handleAddProfile = async () => {
    if (!newName.trim()) return;
    await axios.post("/api/profiles", { name: newName, image: newImage });
    mutate();
    setShowAdd(false);
    setNewName("");
  };

  const handleDeleteProfile = async (e: any, profileId: string) => {
    e.stopPropagation();
    await axios.delete("/api/profiles", { data: { profileId } });
    mutate();
  };

  const handleEditProfile = async () => {
    if (!editName.trim() || !editingProfile) return;
    await axios.patch("/api/profiles", {
      profileId: editingProfile.id,
      name: editName,
      image: editingProfile.image,
    });
    mutate();
    setEditingProfile(null);
    setEditName("");
  };

  return (
    <div className="flex items-center h-screen justify-center bg-black">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-6xl text-white text-center mb-10">
          Who is watching?
        </h1>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          {profiles.map((profile: any) => (
            <div
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className="group flex flex-col items-center cursor-pointer relative"
            >
              <div className="relative w-32 h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {/* Delete button */}
                <div
                  onClick={(e) => handleDeleteProfile(e, profile.id)}
                  className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition z-10"
                >
                  <AiOutlineDelete size={14} className="text-white" />
                </div>
              </div>

              {/* Name + Edit button */}
              <div className="flex items-center gap-2 mt-3">
                <p className="text-gray-400 text-lg group-hover:text-white transition">
                  {profile.name}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProfile(profile);
                    setEditName(profile.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-white"
                >
                  <BsPencil size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <div
              onClick={() => setShowAdd(true)}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-32 h-32 rounded-md border-2 border-transparent group-hover:border-white transition bg-zinc-800 flex items-center justify-center">
                <AiOutlinePlus
                  size={40}
                  className="text-gray-400 group-hover:text-white transition"
                />
              </div>
              <p className="text-gray-400 text-lg mt-3 group-hover:text-white transition">
                Add Profile
              </p>
            </div>
          )}
        </div>

        {/* Add Profile Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-8 rounded-md w-96">
              <h2 className="text-white text-2xl font-bold mb-6">
                Add Profile
              </h2>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Profile name"
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-4 focus:outline-none"
              />
              <p className="text-gray-400 text-sm mb-3">Choose avatar:</p>
              <div className="flex gap-3 mb-6">
                {AVATAR_OPTIONS.map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    onClick={() => setNewImage(avatar)}
                    className={`w-16 h-16 rounded-md cursor-pointer border-2 transition ${
                      newImage === avatar
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddProfile}
                  className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAdd(false);
                    setNewName("");
                  }}
                  className="bg-zinc-700 text-white px-6 py-2 rounded font-semibold hover:bg-zinc-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {editingProfile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-8 rounded-md w-96">
              <h2 className="text-white text-2xl font-bold mb-6">
                Edit Profile
              </h2>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Profile name"
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-4 focus:outline-none"
              />
              <p className="text-gray-400 text-sm mb-3">Choose avatar:</p>
              <div className="flex gap-3 mb-6">
                {AVATAR_OPTIONS.map((avatar) => (
                  <img
                    key={avatar}
                    src={avatar}
                    onClick={() =>
                      setEditingProfile({ ...editingProfile, image: avatar })
                    }
                    className={`w-16 h-16 rounded-md cursor-pointer border-2 transition ${
                      editingProfile.image === avatar
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleEditProfile}
                  className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProfile(null)}
                  className="bg-zinc-700 text-white px-6 py-2 rounded font-semibold hover:bg-zinc-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
