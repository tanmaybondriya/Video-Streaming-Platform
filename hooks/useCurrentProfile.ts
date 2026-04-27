import { create } from "zustand";

interface ProfileStore {
  currentProfile: any;
  setCurrentProfile: (profile: any) => void;
}

const useCurrentProfile = create<ProfileStore>((set) => ({
  currentProfile: null,
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
}));

export default useCurrentProfile;
