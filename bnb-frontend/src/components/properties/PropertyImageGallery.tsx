import React from "react";
import { Property } from "@/models/property.model";

interface PropertyImageGalleryProps {
  property: Property;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  property,
}) => {
  return (
    <div className="mb-8 grid grid-cols-8 gap-4">
      <img
        src={property.imageUrl}
        alt={property.name}
        className="col-span-4 row-span-2 w-full h-full object-cover rounded-2xl shadow-xl"
      />

      {property.additionalImages &&
        property.additionalImages.length > 0 &&
        property.additionalImages
          .slice(0, 4)
          .map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${property.name} additional image ${index + 1}`}
              className="col-span-2 h-full w-full object-cover rounded-xl shadow-md"
            />
          ))}
    </div>
  );
};

export default PropertyImageGallery;
