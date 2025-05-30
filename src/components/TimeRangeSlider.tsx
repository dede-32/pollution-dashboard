"use client";

export default function TimeRangeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const min = 1;
  const max = 168;

  const valueToLabel = (val: number): string => {
    if (val < 24) return `${val} h`;
    const days = Math.floor(val / 24);
    const hours = val % 24;
    if (hours === 0) return `${days} d`;
    return `${days} d ${hours} h`;
  };

  const currentLabel = valueToLabel(value);

  return (
    <div className="mb-6">
      {/* Zvýrazněný, vystředěný popis */}
      <div className="text-center text-lg font-semibold text-gray-800 mb-2">
        Zobrazený rozsah: {currentLabel}
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
      />
    </div>
  );
}
