import React, { useState } from "react";
import Image from "next/image";
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
        <div className="col-span-4 row-span-2 relative w-full h-full rounded-2xl shadow-xl overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover cursor-pointer"
            onClick={() => openModal(property.imageUrl)}
          />
        </div>

        {property.additionalImages &&
          property.additionalImages.length > 0 &&
          property.additionalImages.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className="col-span-2 relative h-full w-full rounded-xl shadow-md overflow-hidden"
            >
              <Image
                src={img}
                alt={`${property.name} additional image ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover cursor-pointer"
                onClick={() => openModal(img)}
              />
            </div>
          ))}
      </div>

      {showModal && (
        <dialog className="modal modal-open" onClick={closeModal}>
          <div
            className="modal-box relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
              onClick={closeModal}
            >
              ✕
            </button>
            <Image
              src={selectedImage}
              alt="Enlarged property image"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </dialog>
      )}
    </>
  );
};

export default PropertyImageGallery;
