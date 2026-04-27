import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export const config = {
  api: { bodyParser: false },
};

const convertVideo = (
  inputPath: string,
  outputPath: string,
  resolution: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const scaleMap: Record<string, string> = {
      "480p": "854:480",
      "720p": "1280:720",
      "1080p": "1920:1080",
    };

    ffmpeg(inputPath)
      .outputOptions([
        `-vf scale=${scaleMap[resolution]}`,
        "-c:v libx264",
        "-crf 23",
        "-preset fast",
        "-c:a aac",
        "-b:a 128k",
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { currentUser } = await serverAuth(req, res);

    if (
      currentUser.role !== "video_provider" &&
      currentUser.role !== "super_admin"
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const uploadDir = path.join(process.cwd(), "public/videos");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB max
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload failed" });

      const file = Array.isArray(files.video) ? files.video[0] : files.video;
      if (!file) return res.status(400).json({ error: "No video file" });

      const inputPath = file.filepath;
      const baseName = path.basename(inputPath, path.extname(inputPath));

      const output480 = path.join(uploadDir, `${baseName}_480p.mp4`);
      const output720 = path.join(uploadDir, `${baseName}_720p.mp4`);
      const output1080 = path.join(uploadDir, `${baseName}_1080p.mp4`);

      try {
        await Promise.all([
          convertVideo(inputPath, output480, "480p"),
          convertVideo(inputPath, output720, "720p"),
          convertVideo(inputPath, output1080, "1080p"),
        ]);
      } catch (ffmpegErr) {
        console.error("FFmpeg error:", ffmpegErr);
        return res.status(500).json({ error: "Video conversion failed" });
      }

      const getValue = (field: any) =>
        Array.isArray(field) ? field[0] : field;

      const movie = await prismadb.movie.create({
        data: {
          title: getValue(fields.title),
          description: getValue(fields.description),
          genre: getValue(fields.genre),
          duration: getValue(fields.duration),
          language: getValue(fields.language) || "English",
          type: getValue(fields.type) || "movie",
          thumbnailUrl: getValue(fields.thumbnailUrl),
          videoUrl: `/videos/${path.basename(inputPath)}`,
          video480p: `/videos/${path.basename(output480)}`,
          video720p: `/videos/${path.basename(output720)}`,
          video1080p: `/videos/${path.basename(output1080)}`,
          uploadedBy: currentUser.id,
        },
      });

      return res.status(200).json(movie);
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Something went wrong" });
  }
}
