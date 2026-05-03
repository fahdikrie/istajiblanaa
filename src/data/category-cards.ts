import CATEGORY_IMAGES from "@/data/generated/category-images.json";

export type CategoryCard = {
  title: string;
  description: string;
  href: string;
  cue: string;
  imagePath?: string;
};

export const featuredCategoryCards: CategoryCard[] = [
  {
    title: "Semua Doa",
    description: "Semua Doa Ma'tsuur. Datang dari Al-Qur'an maupun As-Sunnah.",
    href: "/list/semua-doa",
    cue: "prayer hands serenity",
  },
  {
    title: "The Essentials 🎒",
    description: "Kumpulan doa-doa pilihan. Dapat dibaca di setiap waktu mustajab.",
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
    description: "Doa-doa yang dipanjatkan oleh para Nabi terdahulu 'Alaihimussalaam.",
    href: "/list/doa-para-nabi",
    cue: "desert dawn prophetic journey",
  },
];

const CATEGORY_IMAGE_MAP = new Map(
  (CATEGORY_IMAGES as Array<{ title: string; imagePath?: string }>)
    .filter((item) => item.imagePath)
    .map((item) => [item.title, item.imagePath as string]),
);

export const getCategoryImagePath = (title: string, cue: string) =>
  CATEGORY_IMAGE_MAP.get(title) ?? getUnsplashImageUrl(cue);

export const getUnsplashImageUrl = (cue: string) =>
  `https://source.unsplash.com/featured/1200x900/?${encodeURIComponent(cue)}`;
