"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProperties } from "@/hooks/useProperties";
import FilterSidebar from "../../components/properties/FilterSidebar";
import { useState, useEffect } from "react";
import { Property } from "@/models/property.model";
import Pagination from "@/components/common/Pagination";
import PropertyCard from "@/components/properties/PropertyCard"; // Import the new component

interface Filter {
  location: string;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number | null;
}

const PropertiesPage = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const { properties, loading, error, deleteProperty } =
    useProperties(searchTerm);
  const { user } = useAuth();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  useEffect(() => {
    setFilteredProperties(properties);
    setCurrentPage(1); // Reset to first page on properties change
  }, [properties]);

  const handleFilterChange = (filters: Filter) => {
    let tempProperties = [...properties];

    if (filters.location) {
      tempProperties = tempProperties.filter(
        (p) => p.location === filters.location
      );
    }

    if (filters.minPrice !== null) {
      tempProperties = tempProperties.filter(
        (p) => p.pricePerNight >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== null) {
      tempProperties = tempProperties.filter(
        (p) => p.pricePerNight <= filters.maxPrice!
      );
    }

    if (filters.rating !== null) {
      tempProperties = tempProperties.filter(
        (p) => p.rating >= filters.rating!
      );
    }

    setFilteredProperties(tempProperties);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }
    try {
      await deleteProperty(propertyId);
      alert("Property deleted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex">
      <FilterSidebar
        properties={properties}
        onFilterChange={handleFilterChange}
      />
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-bold text-center">
            Featured Apartments
          </h1>
          <p className="text-center">
            Handpicked properties for your perfect getaway
          </p>
        </div>
        {currentProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  user={user}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
            <Pagination
              propertiesPerPage={propertiesPerPage}
              totalProperties={filteredProperties.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        ) : (
          <p>
            {searchTerm
              ? "No properties found matching your search."
              : "No properties available at the moment."}
          </p>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
