"use client";

import { useState, useEffect } from "react";
import { Property } from "@/models/property.model";

interface FilterSidebarProps {
  properties: Property[];
  onFilterChange: (filters: {
    location: string;
    minPrice: number | null;
    maxPrice: number | null;
  }) => void;
}

export default function FilterSidebar({ properties, onFilterChange }: FilterSidebarProps) {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);

  useEffect(() => {
    if (properties) {
      const locations = [...new Set(properties.map((p) => p.location))];
      setUniqueLocations(locations);
    }
  }, [properties]);

  const handleFilter = () => {
    onFilterChange({
      location,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
  };

  return (
    <aside className="w-64 p-4 bg-base-200">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <select
          className="select select-bordered"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Price Range</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input input-bordered w-full"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="input input-bordered w-full"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary w-full" onClick={handleFilter}>
        Apply Filters
      </button>
    </aside>
  );
}