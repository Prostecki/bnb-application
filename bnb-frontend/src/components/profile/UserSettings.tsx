import React, { useState, useEffect } from "react";
import type { User } from "@/models/user.model";

interface UserSettingsProps {
  user: User | null;
  onDataChange: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user, onDataChange }) => {
  const [description, setDescription] = useState(user?.description || "");
  const [location, setLocation] = useState(user?.location || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setDescription(user?.description || "");
    setLocation(user?.location || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const updatedFields: { description?: string; location?: string } = {};
      if (description !== user?.description) {
        updatedFields.description = description;
      }
      if (location !== user?.location) {
        updatedFields.location = location;
      }

      if (Object.keys(updatedFields).length === 0) {
        setMessage("No changes to save.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }

      setMessage("Profile updated successfully!");
      onDataChange(); // Refresh user data in parent component
    } catch (err: any) {
      setMessage(err.message || "An error occurred.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">User Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, USA"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {message && (
          <div
            className={`alert ${
              isError ? "alert-error" : "alert-success"
            } mt-4`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserSettings;
