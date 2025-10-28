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
      <h3 className="mb-5">Meet your host</h3>
      <div className="flex justify-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="text-3xl">{toUpperCaseName(host.name[0])}</span>
            </div>
          </div>
          <p className="text-3xl text-center font-[700]">
            {toUpperCaseName(host.name)}
          </p>
          <p className="text-center">Host</p>
        </div>
        <div className="ml-10 w-full flex flex-col justify-center gap-4">
          <div className="flex gap-4">
            <img
              className="w-10 object-contain"
              src="/description-icon.png"
              alt=""
            />
            <p className="">{host.description}</p>
          </div>
          <div className="flex gap-4 items-center">
            <img className="w-10" src="/location-icon.png" alt="" />
            <p>{host.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;
