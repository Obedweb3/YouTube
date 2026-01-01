import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(cors());

app.get("/download", (req, res) => {
  const { url, type, quality } = req.query;
  if (!url) return res.status(400).send("Missing video URL");

  const filename = `yt_${Date.now()}`;

  let command;
  if (type === "mp3") {
    command = `yt-dlp -x --audio-format mp3 --audio-quality ${quality || 128} -o "${filename}.%(ext)s" "${url}"`;
  } else {
    command = `yt-dlp -f "bestvideo[height<=${quality||720}]+bestaudio/best" -o "${filename}.%(ext)s" "${url}"`;
  }

  exec(command, (err) => {
    if (err) return res.status(500).send("Download failed");

    const ext = type === "mp3" ? "mp3" : "mp4";
    const filePath = `${filename}.${ext}`;

    res.download(filePath, () => fs.unlinkSync(filePath));
  });
});

app.listen(3000, () =>
  console.log("✅ Downloader running → http://localhost:3000")
);
