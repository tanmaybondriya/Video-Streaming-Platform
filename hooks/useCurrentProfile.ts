import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileStore {
  currentProfile: any;
  setCurrentProfile: (profile: any) => void;
}

const useCurrentProfile = create<ProfileStore>()(
  persist(
    (set) => ({
      currentProfile: null,
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
    }),
    {
      name: "current-profile",
    },
  ),
);

export default useCurrentProfile;
