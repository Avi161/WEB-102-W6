import { useEffect, useMemo, useState } from "react";
import "../App.css";
import DogInfo from "../components/DogInfo";
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, Legend
} from "recharts";

const API_KEY = import.meta.env.VITE_DOG_API_KEY;

function avgFromRange(str) {
  if (!str) return null;
  // handle formats like "20 - 30" or "20" or "NaN"
  const parts = String(str).split("-").map(s => parseFloat(s.trim()));
  const nums = parts.filter(n => Number.isFinite(n));
  if (nums.length === 0) return null;
  if (nums.length === 1) return nums[0];
  return (nums[0] + nums[1]) / 2;
}

export default function Dashboard() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://api.thedogapi.com/v1/breeds", {
          headers: API_KEY ? { "x-api-key": API_KEY } : {}
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDogs(data);
      } catch (e) {
        setError(e.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Chart 1: Top 10 breed groups by number of breeds
  const groupCounts = useMemo(() => {
    const map = new Map();
    dogs.forEach(d => {
      const g = d.breed_group || "Unknown";
      map.set(g, (map.get(g) || 0) + 1);
    });
    const arr = Array.from(map, ([group, count]) => ({ group, count }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 10);
  }, [dogs]);

  // Chart 2: Height vs Weight (average metric values)
  const heightWeight = useMemo(() => {
    return dogs.map(d => {
      const weight = avgFromRange(d.weight?.metric);
      const height = avgFromRange(d.height?.metric);
      if (!Number.isFinite(weight) || !Number.isFinite(height)) return null;
      return {
        name: d.name,
        weight,  // kg
        height,  // cm
      };
    }).filter(Boolean);
  }, [dogs]);

  if (loading) return <p className="muted">Loading…</p>;
  if (error) return <p className="muted">Error: {error}</p>;

  return (
    <div>
      <div className="header">
        <h1>Dogs Dashboard</h1>
        <div className="muted">Breeds: {dogs.length}</div>
      </div>

      <div className="charts">
        <div className="chart-card">
          <h3>Breeds per Group (Top 10)</h3>
          <ResponsiveContainer width={400} height={300}>
            <BarChart data={groupCounts} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" angle={-25} textAnchor="end" interval={0} height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Height vs Weight</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="weight" name="Weight" unit=" kg" />
              <YAxis type="number" dataKey="height" name="Height" unit=" cm" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter name="Breeds" data={heightWeight} fill="#10b981" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dog-list">
        {dogs.map((dog) => (
          <DogInfo
            key={dog.id}
            id={dog.id}
            name={dog.name}
            breed={dog.breed_group}
            life_span={dog.life_span}
          />
        ))}
      </div>
    </div>
  );
}
