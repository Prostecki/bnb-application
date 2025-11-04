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
      <div className="mb-8 grid grid-cols-8 grid-rows-2 gap-4 h-[50vh] max-h-[500px]">
        {/* Main Image */}
        <div className="col-span-4 row-span-2 rounded-2xl shadow-xl overflow-hidden cursor-pointer">
          <Image
            src={property.imageUrl}
            alt={property.name}
            width={800} // Provide aspect ratio, CSS will handle final size
            height={600} // Provide aspect ratio, CSS will handle final size
            className="w-full h-full object-cover"
            onClick={() => openModal(property.imageUrl)}
          />
        </div>

        {/* Additional Images */}
        {property.additionalImages &&
          property.additionalImages.length > 0 &&
          property.additionalImages.slice(0, 4).map((img, index) => (
            <div
              key={index}
              className="col-span-2 rounded-xl shadow-md overflow-hidden cursor-pointer"
            >
              <Image
                src={img}
                alt={`${property.name} additional image ${index + 1}`}
                width={400} // Provide aspect ratio
                height={300} // Provide aspect ratio
                className="w-full h-full object-cover"
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
