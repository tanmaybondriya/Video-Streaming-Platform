import { useRouter } from "next/router";
import { useState, useEffect, useRef, useCallback } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import {
  BsFillPlayFill,
  BsFillPauseFill,
  BsFullscreen,
  BsFullscreenExit,
} from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import useMovie from "@/hooks/useMovie";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import axios from "axios";

type Resolution = "480p" | "720p" | "1080p";

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const { data: movie } = useMovie(movieId as string);
  const { currentProfile } = useCurrentProfile();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeout = useRef<NodeJS.Timeout>();
  const progressSaveInterval = useRef<NodeJS.Timeout>();

  const [resolution, setResolution] = useState<Resolution>("720p");
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [volume, setVolume] = useState(1);

  const [hoverTime, setHoverTime] = useState(0);
  const [hoverX, setHoverX] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const videoSrc =
    {
      "480p": movie?.video480p,
      "720p": movie?.video720p,
      "1080p": movie?.video1080p,
    }[resolution] || movie?.videoUrl;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // save progress to API
  const saveProgress = useCallback(async () => {
    if (!movieId || !currentProfile?.id || !videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (currentTime < 5) return; // don't save if barely started
    await axios.post(`/api/watched?profileId=${currentProfile.id}`, {
      movieId,
      progress: currentTime,
    });
  }, [movieId, currentProfile]);

  // restore progress when video loads
  useEffect(() => {
    if (!movie || !currentProfile?.id) return;
    const savedProgress = localStorage.getItem(`watch-progress-${movieId}`);
    if (savedProgress && videoRef.current) {
      videoRef.current.currentTime = Number(savedProgress);
    }
  }, [movie, movieId, currentProfile]);

  // save progress every 10 seconds
  useEffect(() => {
    progressSaveInterval.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        localStorage.setItem(
          `watch-progress-${movieId}`,
          String(videoRef.current.currentTime),
        );
        saveProgress();
      }
    }, 10000);

    return () => {
      if (progressSaveInterval.current)
        clearInterval(progressSaveInterval.current);
    };
  }, [movieId, saveProgress]);

  // save progress when leaving page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current) {
        localStorage.setItem(
          `watch-progress-${movieId}`,
          String(videoRef.current.currentTime),
        );
      }
    };

    router.events.on("routeChangeStart", () => {
      handleBeforeUnload();
      saveProgress();
    });

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleBeforeUnload);
    };
  }, [movieId, saveProgress, router.events]);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [resetHideTimer]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      resetHideTimer();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (isNaN(total)) return;
    setProgress((current / total) * 100);
    setCurrentTime(formatTime(current));
    setDuration(formatTime(total));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !videoRef.current ||
      !videoRef.current.duration ||
      isNaN(videoRef.current.duration)
    )
      return;
    const time = (Number(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = time;
    setProgress(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = Number(e.target.value);
    videoRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const changeResolution = (res: Resolution) => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;
    setResolution(res);
    setShowResolutionMenu(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) videoRef.current.play();
      }
    }, 500);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen bg-black relative overflow-hidden"
      onMouseMove={resetHideTimer}
      onClick={() => {
        togglePlay();
        resetHideTimer();
      }}
    >
      <video
        ref={videoRef}
        key={resolution}
        className="h-full w-full"
        autoPlay
        src={videoSrc}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Top Bar */}
      <div
        className={`absolute top-0 left-0 right-0 px-6 py-6 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <AiOutlineArrowLeft
          onClick={(e) => {
            e.stopPropagation();
            router.push("/");
          }}
          size={36}
          className="text-white cursor-pointer hover:opacity-80 transition"
        />
        <p className="text-white text-xl md:text-2xl font-bold">
          <span className="font-light mr-2">Watching:</span>
          {movie?.title}
        </p>
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-6 pb-6 pt-16 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full mb-4"
          onMouseMove={(e) => {
            if (!videoRef.current || !progressBarRef.current) return;
            const rect = progressBarRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(1, x / rect.width));
            const time = percent * (videoRef.current.duration || 0);
            setHoverTime(time);
            setHoverX(e.clientX - rect.left);
            setShowPreview(true);
          }}
          onMouseLeave={() => setShowPreview(false)}
        >
          {showPreview && movie?.spritesUrl && (
            <div
              className="absolute bottom-8 transform -translate-x-1/2 pointer-events-none z-50"
              style={{ left: `${hoverX}px` }}
            >
              <div className="bg-black rounded overflow-hidden shadow-xl border border-white/20">
                <img
                  src={`${movie.spritesUrl}/thumb_${String(Math.max(1, Math.floor(hoverTime / 10) + 1)).padStart(4, "0")}.jpg`}
                  className="w-40 h-24 object-cover"
                  alt="preview"
                />
                <p className="text-white text-xs text-center py-1 bg-black/80">
                  {formatTime(hoverTime)}
                </p>
              </div>
              <div className="w-0 h-0 mx-auto border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
            </div>
          )}
          <input
            ref={progressBarRef}
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 accent-red-600 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #dc2626 ${progress}%, #52525b ${progress}%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="text-white hover:opacity-80 transition"
            >
              {isPlaying ? (
                <BsFillPauseFill size={30} />
              ) : (
                <BsFillPlayFill size={30} />
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:opacity-80 transition"
              >
                {isMuted || volume === 0 ? (
                  <HiSpeakerXMark size={26} />
                ) : (
                  <HiSpeakerWave size={26} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 accent-white cursor-pointer"
              />
            </div>

            <span className="text-white text-sm">
              {currentTime} / {duration}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowResolutionMenu(!showResolutionMenu)}
                className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded border border-white/30 hover:border-white transition"
              >
                {resolution} ▾
              </button>
              {showResolutionMenu && (
                <div className="absolute bottom-10 right-0 bg-black/90 border border-white/20 rounded-md overflow-hidden w-28">
                  <p className="text-gray-400 text-xs px-4 py-2 border-b border-white/10">
                    Quality
                  </p>
                  {(["1080p", "720p", "480p"] as Resolution[]).map((res) => (
                    <button
                      key={res}
                      onClick={() => changeResolution(res)}
                      className={`w-full text-left px-4 py-2 text-sm transition hover:bg-white/10 flex items-center justify-between ${resolution === res ? "text-white font-semibold" : "text-gray-300"}`}
                    >
                      {res}
                      {resolution === res && (
                        <span className="text-red-500">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:opacity-80 transition"
            >
              {isFullscreen ? (
                <BsFullscreenExit size={22} />
              ) : (
                <BsFullscreen size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-6">
            <BsFillPlayFill size={60} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;
