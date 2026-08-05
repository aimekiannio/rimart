"use client";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export function SearchBar({
  search,
  setSearch,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}