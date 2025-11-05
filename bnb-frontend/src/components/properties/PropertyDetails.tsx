import React from "react";

interface PropertyDetailsProps {
  description: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ description }) => {
  return (
    <div className="border-b border-base-300 pb-6 mb-6">
      <h2 className="text-2xl font-bold mb-2">About this property</h2>
      <p className="text-black dark:text-white leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default PropertyDetails;
