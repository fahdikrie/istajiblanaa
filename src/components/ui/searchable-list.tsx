import { useState } from "react";
import { Input } from "./input";
import { Card, CardContent } from "./card";

// Data kategori doa
const categories = [
  { id: 1, name: "Doa Pagi", slug: "doa-pagi" },
  { id: 2, name: "Doa Sore", slug: "doa-sore" },
  { id: 3, name: "Doa Ramadhan", slug: "doa-ramadhan" },
  { id: 4, name: "Doa Perlindungan", slug: "doa-perlindungan" },
  { id: 5, name: "Doa Keselamatan", slug: "doa-keselamatan" },
  { id: 6, name: "Doa Rezeki", slug: "doa-rezeki" },
];

export const SearchableList = () => {
  const [query, setQuery] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Cari doa..."
        className="w-full p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* List Kategori / Hasil Pencarian */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <Card key={cat.id} className="p-4 cursor-pointer hover:bg-gray-100">
              <CardContent>{cat.name}</CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500">
            Tidak ditemukan
          </p>
        )}
      </div>
    </div>
  );
};
