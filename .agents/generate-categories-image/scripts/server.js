#!/usr/bin/env node

/**
 * Minimal Unsplash helper for category image generation.
 *
 * Usage:
 *   UNSPLASH_ACCESS_KEY=... node server.js "Kebaikan, Kesehatan dan Keberkahan" "Permohonan ..."
 *
 * Output:
 *   JSON with a search cue + a best-effort Unsplash photo result.
 *   If DOWNLOAD_DIR is set, the selected image is also downloaded locally.
 */

const [, , title = "", description = ""] = process.argv;

if (!title) {
  console.error('Usage: node server.js "title" "description"');
  process.exit(1);
}

const cue = buildCue(title, description);
const accessKey = process.env.UNSPLASH_ACCESS_KEY;

async function main() {
  if (!accessKey) {
    process.stdout.write(
      JSON.stringify(
        {
          title,
          description,
          cue,
          image_url: null,
          local_path: null,
          note: "UNSPLASH_ACCESS_KEY not set",
        },
        null,
        2,
      ) + "\n",
    );
    return;
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", cue);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("per_page", "1");
  url.searchParams.set("content_filter", "high");

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Unsplash API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const photo = data.results?.[0];
  const imageUrl = photo?.urls?.regular ?? null;
  const localPath =
    imageUrl && process.env.DOWNLOAD_DIR
      ? await downloadImage(imageUrl, process.env.DOWNLOAD_DIR, photo.id)
      : null;

  process.stdout.write(
    JSON.stringify(
      {
        title,
        description,
        cue,
        image_url: imageUrl,
        local_path: localPath,
        photo_id: photo?.id ?? null,
        photographer_name: photo?.user?.name ?? null,
        photographer_username: photo?.user?.username ?? null,
        attribution_text: photo
          ? `Photo by ${photo.user.name} on Unsplash`
          : null,
        attribution_html: photo
          ? `Photo by <a href="https://unsplash.com/@${photo.user.username}?utm_source=istajiblanaa&utm_medium=referral">${photo.user.name}</a> on <a href="https://unsplash.com/?utm_source=istajiblanaa&utm_medium=referral">Unsplash</a>`
          : null,
      },
      null,
      2,
    ) + "\n",
  );
}

async function downloadImage(imageUrl, downloadDir, photoId) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  await fs.mkdir(downloadDir, { recursive: true });
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`download failed ${res.status}`);
  const ext = "jpg";
  const file = path.join(downloadDir, `${photoId}.${ext}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(file, buf);
  return file;
}

function buildCue(title, description) {
  const parts = [title, description]
    .join(" ")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const stop = new Set([
    "doa",
    "untuk",
    "dan",
    "dari",
    "the",
    "of",
    "to",
    "a",
    "an",
    "yang",
    "di",
    "ke",
    "dengan",
  ]);
  const keywords = parts.filter((w) => !stop.has(w)).slice(0, 5);
  return keywords.length ? keywords.join(" ") : "prayer calm";
}

main().catch((err) => {
  console.error(err.stack || err.message || String(err));
  process.exit(1);
});
