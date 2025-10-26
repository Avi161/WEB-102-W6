import { useEffect, useState } from "react";
import "./App.css";
import DogInfo from "./components/DogInfo";

const API_KEY = import.meta.env.VITE_DOG_API_KEY;

function App() {
  const [dogs, setDogs] = useState([]);
  const [searchDogs, setSearchDogs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");

  // 🐶 Fetch all dog data
  useEffect(() => {
    const getDogs = async () => {
      const query = "https://api.thedogapi.com/v1/breeds";
      const response = await fetch(query, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const json = await response.json();
      setDogs(json);
      setSearchDogs(json);
    };
    getDogs().catch(console.error);
  }, []);

  // 🔍 Combined search + filter logic
  const filterDogs = (searchValue, groupValue) => {
    setSearchInput(searchValue);
    setSelectedGroup(groupValue || selectedGroup);

    let filtered = dogs;

    // filter by search input
    if (searchValue.trim() !== "") {
      filtered = filtered.filter((dog) =>
        dog.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // filter by breed group
    const groupFilter = groupValue || selectedGroup;
    if (groupFilter !== "All") {
      filtered = filtered.filter((dog) => dog.breed_group === groupFilter);
    }

    setSearchDogs(filtered);
  };

  // 📊 1. Average lifespan
  const calculateLifeSpan = () => {
    const list = searchDogs.length > 0 ? searchDogs : dogs;
    if (list.length === 0) return 0;

    const total = list.reduce((acc, dog) => {
      const parts = dog.life_span.split(" ");
      const range = parts[0].split("-").map(Number);
      const avgSpan = (range[0] + (range[1] || range[0])) / 2;
      return acc + avgSpan;
    }, 0);

    return (total / list.length).toFixed(1);
  };

  // 📊 2. Lifespan range
  const getLifeSpanRange = () => {
    let min = Infinity;
    let max = 0;
    const list = searchDogs.length > 0 ? searchDogs : dogs;
    if (list.length < 2) return null;

    for (const dog of list) {
      const range = dog.life_span
        .split(" ")
        .map((p) => parseInt(p))
        .filter((num) => !isNaN(num));

      if (range.length === 1) {
        min = Math.min(min, range[0]);
        max = Math.max(max, range[0]);
      } else if (range.length === 2) {
        min = Math.min(min, range[0]);
        max = Math.max(max, range[1]);
      }
    }
    if (min === Infinity || max === 0) return null;
    return { min, max };
  };

  // 📊 3. Most common breed group
  const getMostCommonBreedGroup = () => {
    const list = searchDogs.length > 0 ? searchDogs : dogs;
    const counts = {};
    list.forEach((dog) => {
      if (!dog.breed_group) return;
      counts[dog.breed_group] = (counts[dog.breed_group] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "Unknown";
  };

  const lifeRange = getLifeSpanRange();

  return (
    <div className="App">
      <h1>🐾 Dogs Dashboard</h1>

      {/* 🔍 Search + Filter Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by breed name..."
          value={searchInput}
          onChange={(e) => filterDogs(e.target.value, selectedGroup)}
        />

        <select
          value={selectedGroup}
          onChange={(e) => filterDogs(searchInput, e.target.value)}
        >
          <option value="All">All Breed Groups</option>
          <option value="Herding">Herding</option>
          <option value="Working">Working</option>
          <option value="Sporting">Sporting</option>
          <option value="Toy">Toy</option>
          <option value="Terrier">Terrier</option>
          <option value="Non-Sporting">Non-Sporting</option>
          <option value="Hound">Hound</option>
        </select>
      </div>

      {/* 📊 Summary Statistics */}
      <div className="stats">
        <h3>Total Breeds: {searchDogs.length}</h3>
        <h3>Average Lifespan: {calculateLifeSpan()} years</h3>
        <h3>
          Lifespan Range:{" "}
          {lifeRange ? `${lifeRange.min} - ${lifeRange.max} years` : "N/A"}
        </h3>
        <h3>Most Common Group: {getMostCommonBreedGroup()}</h3>
      </div>

      {/* 🐕 Dog List Display */}
      <div className="dog-list">
        {searchDogs.length > 0 ? (
          searchDogs.map((dog, index) => (
            <DogInfo
              key={index}
              name={dog.name}
              breed={dog.breed_group}
              life_span={dog.life_span}
            />
          ))
        ) : (
          <p>No breeds found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
