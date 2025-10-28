import React from "react";

interface PropertyHeaderProps {
  propertyName: string;
  isOwner: boolean;
  onEditClick: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  propertyName,
  isOwner,
  onEditClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold">{propertyName}</h1>
      {isOwner && (
        <button onClick={onEditClick} className="btn btn-secondary">
          Edit Property
        </button>
      )}
    </div>
  );
};

export default PropertyHeader;
