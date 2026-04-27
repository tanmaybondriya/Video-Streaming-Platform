import useSwr from "swr";
import fetcher from "@/lib/fetcher";

const useMovieList = (params?: {
  type?: string;
  language?: string;
  sortBy?: string;
}) => {
  const query = new URLSearchParams(params as any).toString();
  const { data, error, isLoading } = useSwr(
    `/api/movies${query ? `?${query}` : ""}`,
    fetcher,
  );

  return { data, error, isLoading };
};

export default useMovieList;
