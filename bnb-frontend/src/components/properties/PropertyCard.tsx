import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/models/property.model";
import { User } from "@/models/user.model";
import Rating from "@/components/rating/Rating";

interface PropertyCardProps {
  property: Property;
  user: User | null;
  handleDelete: (propertyId: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, user, handleDelete }) => {
  return (
    <div
      key={property.id}
      className="card card-compact w-full bg-base-100 shadow-xl"
    >
      <figure className="relative h-48 w-full">
        <Image
          src={property.imageUrl}
          alt={property.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </figure>
      <div className="card-body">
        <div className="absolute top-4 right-0 bg-red-500/90 px-2 py-1 text-white rounded-l-md">
          <span className="font-bold">$ {property.pricePerNight}</span> / per night
        </div>
        <h2 className="card-title">{property.name}</h2>
        <p className="truncate">{property.description}</p>
        <Rating rating={property.rating} />
        <div className="card-actions justify-between items-center mt-2">
          <Link
            href={`/properties/${property.id}`}
            className="btn btn-primary"
          >
            View
          </Link>
          {user?.isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(property.id);
              }}
              className="btn btn-error btn-sm"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
