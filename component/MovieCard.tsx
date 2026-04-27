import { useRouter } from "next/router";
import { BsFillPlayFill, BsChevronDown } from "react-icons/bs";
import FavoriteButton from "./FavoriteButton";
import useInfoModal from "@/hooks/useInfoModal";

interface MovieCardProps {
  data: Record<string, any>;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  const router = useRouter();
  const { openModal } = useInfoModal();
  const savedProgress =
    typeof window !== "undefined"
      ? localStorage.getItem(`watch-progress-${data.id}`)
      : null;
  const totalDuration = data.duration ? parseInt(data.duration) * 60 : 0;
  const progressPercent =
    savedProgress && totalDuration
      ? Math.min((Number(savedProgress) / totalDuration) * 100, 100)
      : 0;
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw]">
      <img
        src={data.thumbnailUrl}
        alt={data.title}
        draggable={false}
        className="cursor-pointer object-cover transition duration-300 shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-full h-[12vw]"
      />
      <div className="opacity-0 absolute top-0 transition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw] group-hover:opacity-100">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          draggable={false}
          className="cursor-pointer object-cover transition duration-300 shadow-xl rounded-t-md w-full h-[12vw]"
        />
        <div className="z-10 bg-zinc-800 p-2 lg:p-4 absolute w-full transition shadow-md rounded-b-md">
          <div className="flex flex-row items-center gap-3">
            <div
              onClick={() => router.push(`/watch/${data.id}`)}
              className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
            >
              <BsFillPlayFill size={20} />
            </div>
            <FavoriteButton movieId={data.id} />
            <div
              onClick={() => openModal(data.id)}
              className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
            >
              <BsChevronDown
                size={16}
                className="text-white group-hover/item:text-neutral-300"
              />
            </div>
          </div>
          <p className="text-white font-semibold mt-2">{data.title}</p>
          <div className="flex flex-row mt-4 gap-2 items-center">
            <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
          </div>
          <div className="flex flex-row mt-4 gap-2 items-center">
            <p className="text-white text-[10px] lg:text-sm">{data.genre}</p>
          </div>
          {progressPercent > 0 && (
            <div className="mt-2">
              <div className="bg-zinc-600 rounded-full h-1">
                <div
                  className="bg-red-600 h-1 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {formatTime(Number(savedProgress))} watched
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
