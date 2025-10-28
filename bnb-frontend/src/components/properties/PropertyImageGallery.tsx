import React, { useState } from "react";
import { Property } from "@/models/property.model";

interface PropertyImageGalleryProps {
  property: Property;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  property,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage("");
  };

  return (
    <>
      <div className="mb-8 grid grid-cols-8 gap-4">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="col-span-4 row-span-2 w-full h-full object-cover rounded-2xl shadow-xl cursor-pointer"
          onClick={() => openModal(property.imageUrl)}
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
                className="col-span-2 h-full w-full object-cover rounded-xl shadow-md cursor-pointer"
                onClick={() => openModal(img)}
              />
            ))}
      </div>

      {showModal && (
        <dialog className="modal modal-open" onClick={closeModal}>
          <div
            className="modal-box relative max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Enlarged property image"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </dialog>
      )}
    </>
  );
};

export default PropertyImageGallery;
