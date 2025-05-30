"use client";

export default function TimeRangeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  const steps: { label: string; value: number }[] = [];

  // 1–48 hodin
  for (let i = 1; i <= 48; i++) {
    steps.push({ label: `${i} h`, value: i });
  }

  // 3, 5, 7 dní
  steps.push({ label: "3 dny", value: 72 });
  steps.push({ label: "5 dní", value: 120 });
  steps.push({ label: "7 dní", value: 168 });

  const index = steps.findIndex((s) => s.value === value);
  const currentLabel = steps[index]?.label || `${value} h`;

  // Popisky pod sliderem – vybrané body (pozice v poli `steps`)
  const markerIndexes = [
    0,     // 1 h
    11,    // 12 h
    23,    // 24 h
    47,    // 48 h
    steps.findIndex((s) => s.value === 72),   // 3 dny
    steps.findIndex((s) => s.value === 120),  // 5 dní
    steps.findIndex((s) => s.value === 168),  // 7 dní
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-700 font-medium">
          Rozsah: {currentLabel}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={steps.length - 1}
        value={index}
        onChange={(e) => onChange(steps[+e.target.value].value)}
        className="w-full"
      />

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        {markerIndexes.map((i) => (
          <span key={i} className="text-center w-[10%]">
            {steps[i]?.label}
          </span>
        ))}
      </div>
    </div>
  );
}
