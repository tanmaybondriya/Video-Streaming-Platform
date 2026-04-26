import useSwr from "swr";
import fetcher from "@/lib/fetcher";

const useUsers = () => {
  const { data, error, isLoading, mutate } = useSwr(
    "/api/admin/users",
    fetcher,
  );
  return { data, error, isLoading, mutate };
};

export default useUsers;
