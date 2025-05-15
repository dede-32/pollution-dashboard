"use client";

export type Range = "6h" | "24h" | "7d";

export default function TimeSelector({
  selected,
  onChange,
}: {
  selected: Range;
  onChange: (r: Range) => void;
}) {
  return (
    <div className="flex gap-2 mb-6">
      {["6h", "24h", "7d"].map((r) => (
        <button
          key={r}
          className={`px-4 py-1 rounded border ${
            selected === r ? "bg-blue-600 text-white" : "bg-white text-black"
          }`}
          onClick={() => onChange(r as Range)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
