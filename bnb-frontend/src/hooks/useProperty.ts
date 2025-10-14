"use client";

import { useState, useEffect } from "react";
import type { Property } from "../models/property.model";

export function useProperty(slug: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPropertyData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/properties/${slug}`
        );
        if (!res.ok) {
          throw new Error("Property not found.");
        }
        const data = await res.json();
        setProperty(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getPropertyData();
    }
  }, [slug]);

  return { property, loading, error };
}
