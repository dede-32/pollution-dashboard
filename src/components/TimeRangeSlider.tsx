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

  // Potom 3, 5, 7 dní
  steps.push({ label: "3 dny", value: 72 });
  steps.push({ label: "5 dní", value: 120 });
  steps.push({ label: "7 dní", value: 168 });

  const index = steps.findIndex((s) => s.value === value);

  return (
    <div className="mb-6">
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        value={index}
        onChange={(e) => onChange(steps[+e.target.value].value)}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        {steps.map((s, i) => (
          <span key={i} className="text-center w-[10%]">
            {i % 10 === 0 || i === steps.length - 1 ? s.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
