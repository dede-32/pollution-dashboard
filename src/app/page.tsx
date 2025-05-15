"use client";

import { supabase } from "@/lib/supabase";
import GraphBlock from "@/components/GraphBlock";
import TimeSelector, { Range } from "@/components/selectors";
import { useEffect, useState } from "react";
import type { ScriptableLineSegmentContext } from "chart.js";

export default function Page() {
  const [range, setRange] = useState<Range>("24h");

  interface Measurement {
    timestamp: string;
    iaq: number;
    iaq_accuracy: number;
    temperature: number;
    humidity: number;
    pressure: number;
    bvoc: number;
    co2: number;
    noise_dbc: number;
    pm1: number;
    pm2_5: number;
    pm4: number;
    pm10: number;
    typical_size: number;
    battery_percent: number;
  }

  const [data, setData] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const since = getTimestampForRange(range);
      console.log("Fetching data since:", since);

      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", { ascending: true });

      console.log("Data from Supabase:", data);

      if (!error) setData(data || []);
    };

    fetchData();
  }, [range]);

  // === 🔍 Filtrování záznamů s null hodnotami ===
  const filteredData = data.filter((d) =>
    d.iaq !== null &&
    d.iaq_accuracy !== null &&
    d.temperature !== null &&
    d.humidity !== null &&
    d.pressure !== null &&
    d.bvoc !== null &&
    d.co2 !== null &&
    d.noise_dbc !== null &&
    d.pm1 !== null &&
    d.pm2_5 !== null &&
    d.pm4 !== null &&
    d.pm10 !== null &&
    d.typical_size !== null &&
    d.battery_percent !== null
  );

  const labels = filteredData.map((d) =>
    new Date(d.timestamp).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard znečištění</h1>
      <TimeSelector selected={range} onChange={setRange} />

      <GraphBlock
        title="IAQ + přesnost"
        labels={labels}
        datasets={[
          {
            label: "IAQ",
            data: filteredData.map((d) => d.iaq),
            borderColor: "#3b82f6", // modrá
            yAxisID: "y",
          },
          {
            label: "IAQ Accuracy [%]",
            data: filteredData.map((d) => (d.iaq_accuracy / 3) * 100),
            borderColor: "#f97316", // fallback
            yAxisID: "y1",
            segment: {
              borderColor: (ctx: ScriptableLineSegmentContext) => {
                const i = ctx.p0DataIndex;
                const acc = filteredData[i]?.iaq_accuracy;
                if (acc === 3) return "#22c55e"; // zelená
                if (acc === 2) return "#eab308"; // žlutá
                if (acc === 1) return "#f97316"; // oranžová
                return "#ef4444";               // červená
              },
            },
          },
        ]}
        dualAxis={true}
      />

      <GraphBlock
        title="Teplota a vlhkost"
        labels={labels}
        datasets={[
          {
            label: "Teplota [°C]",
            data: filteredData.map((d) => d.temperature),
            borderColor: "#ef4444",
            yAxisID: "y",
          },
          {
            label: "Vlhkost [%]",
            data: filteredData.map((d) => d.humidity),
            borderColor: "#3b82f6",
            yAxisID: "y1",
          },
        ]}
        dualAxis={true}
      />

      <GraphBlock
        title="Tlak [hPa]"
        labels={labels}
        datasets={[
          {
            label: "Tlak",
            data: filteredData.map((d) => d.pressure),
            borderColor: "#6366f1",
          },
        ]}
      />

      <GraphBlock
        title="CO2 [ppm]"
        labels={labels}
        datasets={[
          {
            label: "CO2",
            data: filteredData.map((d) => d.co2),
            borderColor: "#0ea5e9",
          },
        ]}
      />

      <GraphBlock
        title="bVOC [ppm]"
        labels={labels}
        datasets={[
          {
            label: "bVOC",
            data: filteredData.map((d) => d.bvoc),
            borderColor: "#0ea5e9",
          },
        ]}
      />

      <GraphBlock
        title="Hluk [dBC]"
        labels={labels}
        datasets={[
          {
            label: "Hluk",
            data: filteredData.map((d) => d.noise_dbc),
            borderColor: "#22c55e",
          },
        ]}
      />

      <GraphBlock
        title="Pevné částice a velikost"
        labels={labels}
        datasets={[
          {
            label: "PM1.0",
            data: filteredData.map((d) => d.pm1),
            borderColor: "#6366f1",
            yAxisID: "y",
          },
          {
            label: "PM2.5",
            data: filteredData.map((d) => d.pm2_5),
            borderColor: "#f43f5e",
            yAxisID: "y",
          },
          {
            label: "PM4.0",
            data: filteredData.map((d) => d.pm4),
            borderColor: "#facc15",
            yAxisID: "y",
          },
          {
            label: "PM10",
            data: filteredData.map((d) => d.pm10),
            borderColor: "#a3e635",
            yAxisID: "y",
          },
          {
            label: "Velikost částic [µm]",
            data: filteredData.map((d) => d.typical_size),
            borderColor: "#14b8a6",
            yAxisID: "y1",
          },
        ]}
        dualAxis={true}
      />

      <GraphBlock
        title="Nabití baterie [%]"
        labels={labels}
        datasets={[
          {
            label: "Nabití baterie",
            data: filteredData.map((d) => d.battery_percent),
            borderColor: "#0ea5e9",
          },
        ]}
      />
    </main>
  );
}


function getTimestampForRange(range: Range): string {
  const now = new Date();
  switch (range) {
    case "6h":
      return new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    default:
      throw new Error("Invalid range");
  }
}
