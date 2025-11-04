import React from "react";
import Image from "next/image";

interface PropertyHeaderProps {
  propertyName: string;
  propertyLocation: string;
  isOwner: boolean;
  onEditClick: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  propertyName,
  propertyLocation,
  isOwner,
  onEditClick,
}) => {
  return (
    <div className="grid grid-cols-1 justify-between items-start mb-6">
      <h1 className="text-4xl font-bold">{propertyName}</h1>
      <div className="flex items-center mt-4">
        <Image src="/location.png" alt="Location icon" width={24} height={24} />
        <p className="text-xl dark:text-white text-black">{propertyLocation}</p>
      </div>
      {isOwner && (
        <button onClick={onEditClick} className="btn w-48 btn-primary mt-6">
          Edit Property
        </button>
      )}
    </div>
  );
};

export default PropertyHeader;
