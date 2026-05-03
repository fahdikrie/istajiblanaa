#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
const downloadDir = process.argv[2] ?? "public/generated/category-images";
const manifestPath = path.join(downloadDir, "manifest.json");
const dataPath = "src/data/generated/category-images.json";

const cards = [
  {
    title: "Semua Doa",
    description: "Semua Doa Ma'tsuur. Datang dari Al-Qur'an maupun As-Sunnah.",
    href: "/list/semua-doa",
    cue: "prayer hands serenity",
  },
  {
    title: "The Essentials 🎒",
    description:
      "Kumpulan doa-doa pilihan. Dapat dibaca di setiap waktu mustajab.",
    href: "/list/category/the-essentials",
    cue: "essentials backpack calm sky",
  },
  {
    title: "Kebaikan, Kesehatan dan Keberkahan 🌤️",
    description: "Permohonan atas segala kebaikan & keberkahan di dunia.",
    href: "/list/doa-untuk-kebaikan-kesehatan-dan-keberkahan",
    cue: "healthy life blessing sunlight",
  },
  {
    title: "Doa untuk Kaum Muslimin 🇵🇸",
    description: "Doa untuk kaum muslimin yang terzalimi di seluruh dunia.",
    href: "/",
    cue: "community solidarity hope prayer",
  },
  {
    title: "Perlindungan dari Hal Buruk ☔️",
    description: "Agar terhindar dari kesedihan, kesulitan, dan kesempitan.",
    href: "/list/doa-perlindungan-dari-hal-hal-buruk",
    cue: "storm shelter protection rain",
  },
  {
    title: "Doa untuk Negeri 🇮🇩",
    description: "Kumpulan doa untuk kebaikan negeri & para pemimpinnya.",
    href: "/list/category/kebaikan-untuk-negeri",
    cue: "indonesia city sunrise hope",
  },
  {
    title: "Doa dari Al-Qur'an",
    description: "Doa-doa yang disebut di dalam Al-Qur'an.",
    href: "/list/doa-dari-al-quran",
    cue: "quran manuscript light",
  },
  {
    title: "Doa dari As-Sunnah",
    description: "Doa-doa yang diajarkan oleh Rasulullah ﷺ.",
    href: "/list/doa-dari-as-sunnah",
    cue: "mosque lantern evening",
  },
  {
    title: "Doa para Nabi",
    description:
      "Doa-doa yang dipanjatkan oleh para Nabi terdahulu 'Alaihimussalaam.",
    href: "/list/doa-para-nabi",
    cue: "desert dawn prophetic journey",
  },
];

if (!accessKey) {
  console.error("UNSPLASH_ACCESS_KEY is required");
  process.exit(1);
}

await fs.mkdir(downloadDir, { recursive: true });
const out = [];
for (const card of cards) {
  const photo = await searchPhoto(card.cue, accessKey);
  if (!photo) continue;
  const fileName = `${slugify(card.title)}-${photo.id}.jpg`;
  const localFile = path.join(downloadDir, fileName);
  await download(photo.urls.regular, localFile);
  out.push({
    ...card,
    photo_id: photo.id,
    imagePath: "/" + path.relative("public", localFile).replace(/\\/g, "/"),
  });
  console.log(`Downloaded ${card.title}`);
}

await fs.writeFile(manifestPath, JSON.stringify(out, null, 2));
await fs.mkdir(path.dirname(dataPath), { recursive: true });
await fs.writeFile(dataPath, JSON.stringify(out, null, 2));
console.log(`Wrote ${manifestPath}`);
console.log(`Wrote ${dataPath}`);

async function searchPhoto(query, key) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
  });
  if (!res.ok) throw new Error(`Unsplash search failed ${res.status}`);
  const json = await res.json();
  return json.results?.[0] ?? null;
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
