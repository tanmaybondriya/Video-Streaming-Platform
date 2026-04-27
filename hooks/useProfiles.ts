import useSwr from "swr";
import fetcher from "@/lib/fetcher";

const useProfiles = () => {
  const { data, error, isLoading, mutate } = useSwr("/api/profile", fetcher);
  return { data, error, isLoading, mutate };
};

export default useProfiles;
