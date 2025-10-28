import React from "react";

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
    <div className="flex flex-col justify-between items-start mb-6">
      <h1 className="text-4xl font-bold">{propertyName}</h1>
      <div className="flex items-center mt-4">
        <img className="w-6" src="/location.png" />
        <p className="text-xl text-gray-500/80">{propertyLocation}</p>
      </div>
      {isOwner && (
        <button onClick={onEditClick} className="btn btn-secondary">
          Edit Property
        </button>
      )}
    </div>
  );
};

export default PropertyHeader;
