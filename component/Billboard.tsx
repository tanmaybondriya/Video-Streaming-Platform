import { useRouter } from "next/router";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsFillPlayFill } from "react-icons/bs";
import useBillboard from "@/hooks/useBillboard";
import useInfoModal from "@/hooks/useInfoModal";

const Billboard = () => {
  const router = useRouter();
  const { data: movie } = useBillboard();
  const { openModal } = useInfoModal();

  return (
    <div className="relative h-[56.25vw]">
      <video
        className="w-full h-[56.25vw] object-cover brightness-[60%]"
        autoPlay
        muted
        loop
        src={movie?.videoUrl}
        poster={movie?.thumbnailUrl}
      />
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p className="text-white text-xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">
          {movie?.title}
        </p>
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {movie?.description}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <button
            onClick={() => router.push(`/watch/${movie?.id}`)}
            className="bg-white text-black py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center gap-1 rounded-md hover:bg-opacity-80 transition"
          >
            <BsFillPlayFill size={24} />
            Play
          </button>
          <button
            onClick={() => openModal(movie?.id)}
            className="bg-white bg-opacity-30 text-black py-1 md:py-2 px-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center gap-1 rounded-md hover:bg-opacity-20 transition"
          >
            <AiOutlineInfoCircle size={24} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billboard;
