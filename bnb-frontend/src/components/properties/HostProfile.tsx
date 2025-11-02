import React from "react";
import { toUpperCaseName } from "@/utils/string";

interface HostProfileProps {
  host?: {
    name: string;
    description?: string;
    location?: string;
  };
}

const HostProfile: React.FC<HostProfileProps> = ({ host }) => {
  if (!host) return null;

  return (
    <div>
      <div className="flex flex-col justify-start gap-4">
        <div className="flex items-center gap-2">
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-14 rounded-full">
              <span className="text-3xl">{toUpperCaseName(host.name[0])}</span>
            </div>
          </div>
          <div className="flex items-center">
            <h3 className="text-3xl font-[600]">
              Hosted by {toUpperCaseName(host.name)}{" "}
            </h3>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center gap-4 mt-4 mb-8">
          <div className="flex items-center gap-4">
            <img
              className="w-10 object-contain"
              src="/description-icon.png"
              alt=""
            />
            <p className="text-lg text-black/60">
              {host.description || "The host did not provide some information"}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <img className="w-10" src="/location-icon.png" alt="" />
            <p className="text-lg text-black/60">
              {host.location || "The host didn't provide location"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;
