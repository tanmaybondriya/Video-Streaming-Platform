import useSwr from "swr";
import fetcher from "@/lib/fetcher";
import useCurrentProfile from "./useCurrentProfile";

const useWatched = () => {
  const { currentProfile } = useCurrentProfile();

  const { data, error, isLoading, mutate } = useSwr(
    currentProfile?.id ? `/api/watched?profileId=${currentProfile.id}` : null,
    fetcher,
  );

  return { data, error, isLoading, mutate };
};

export default useWatched;
