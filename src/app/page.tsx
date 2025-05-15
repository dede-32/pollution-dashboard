"use client";

import { supabase } from "@/lib/supabase";
import GraphBlock from "@/components/GraphBlock";
import TimeSelector, { Range } from "@/components/selectors";
import { useEffect, useState } from "react";

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
    console.log("Fetching data since:", since); // ✅

    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .gte("timestamp", since)
      .order("timestamp", { ascending: true });

  //   const { data, error } = await supabase
  // .from("measurements")
  // .select("*")
  // .order("timestamp", { ascending: true });

    console.log("Data from Supabase:", data); // ✅

    if (!error) setData(data || []);
  };

  fetchData();
}, [range]);


  const labels = data.map((d) => new Date(d.timestamp).toLocaleTimeString());

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard znečištění</h1>
      <TimeSelector selected={range} onChange={setRange} />

          {/* TOHLE PAK SMAŽ------------------------------------------------------------------
    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
      {JSON.stringify(data, null, 2)}
    </pre> */}
    
      <GraphBlock
        title="IAQ + přesnost"
        labels={labels}
        datasets={[
          {
            label: "IAQ",
            data: data.map((d) => d.iaq),
            borderColor: "#3b82f6",
            yAxisID: "y",
          },
          {
            label: "IAQ Accuracy",
            data: data.map((d) => d.iaq_accuracy * 100),
            borderColor: "#f97316",
            yAxisID: "y1",
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
            data: data.map((d) => d.temperature),
            borderColor: "#ef4444",
            yAxisID: "y",
          },
          {
            label: "Vlhkost [%]",
            data: data.map((d) => d.humidity),
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
            data: data.map((d) => d.pressure),
            borderColor: "#6366f1",
          },
        ]}
      />

      <GraphBlock
        title="bVOC [ppm]"
        labels={labels}
        datasets={[
          {
            label: "bVOC",
            data: data.map((d) => d.bvoc),
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
            data: data.map((d) => d.noise_dbc),
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
            data: data.map((d) => d.pm1),
            borderColor: "#6366f1",
            yAxisID: "y",
          },
          {
            label: "PM2.5",
            data: data.map((d) => d.pm2_5),
            borderColor: "#f43f5e",
            yAxisID: "y",
          },
          {
            label: "PM4.0",
            data: data.map((d) => d.pm4),
            borderColor: "#facc15",
            yAxisID: "y",
          },
          {
            label: "PM10",
            data: data.map((d) => d.pm10),
            borderColor: "#a3e635",
            yAxisID: "y",
          },
          {
            label: "Velikost částic [µm]",
            data: data.map((d) => d.typical_size),
            borderColor: "#14b8a6",
            yAxisID: "y1",
          },
        ]}
        dualAxis={true}
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
