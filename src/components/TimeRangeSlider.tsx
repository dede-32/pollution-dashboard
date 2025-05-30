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
    if (val < 48) return `${val} h`;
    if (val === 72) return "3 dny";
    if (val === 120) return "5 dní";
    if (val === 168) return "7 dní";
    return `${val} h`;
  };

  const currentLabel = valueToLabel(value);

  const markers = [1, 12, 24, 48, 72, 120, 168];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-700 font-medium">
          Rozsah: {currentLabel}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
      />

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        {markers.map((m) => (
          <span key={m} className="text-center">
            {valueToLabel(m)}
          </span>
        ))}
      </div>
    </div>
  );
}
