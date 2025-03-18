export interface Dua {
  id: number;
  title: {
    title_id: string;
    title_en: string;
  };
  arabic: string;
  arabic_first_person_plural: string | null;
  translation: {
    translation_id: string;
    translation_en: string;
  };
  transliteration: string;
  transliteration_first_person_plural: string | null;
  categories: {
    categories_id: string[];
    categories_en: string[];
  };
  source: string;
  reference: string;
  occasion: {
    occassion_id: string;
    occassion_en: string;
  };
  benefits: {
    benefits_id: string[];
    benefits_en: string[];
  };
  note: {
    note_id: string;
    note_en: string;
  };
}
