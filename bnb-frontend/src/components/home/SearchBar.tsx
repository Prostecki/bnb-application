"use client";
import React from "react";

const handleMessage = () => {
  alert("Searching is not available. Stay tuned!");
};

const SearchBar = () => {
  return (
    <div className="card bg-base-100 shadow-xl p-4 md:p-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="form-control md:col-span-1">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            placeholder="Where to?"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Check-in</span>
          </label>
          <input type="date" className="input input-bordered" />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Check-out</span>
          </label>
          <input type="date" className="input input-bordered" />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Guests</span>
          </label>
          <input
            type="number"
            placeholder="2"
            min="1"
            className="input input-bordered"
          />
        </div>
      </div>
      <button onClick={handleMessage} className="btn btn-primary w-full mt-6">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
