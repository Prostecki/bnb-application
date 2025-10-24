import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="hero min-h-[60vh] bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://picsum.photos/id/1062/800/600"
          className="w-full lg:max-w-lg rounded-lg shadow-2xl"
          alt="Beautiful rental property"
        />
        <div>
          <h1 className="text-5xl font-bold">
            Your perfect stay, just a click away.
          </h1>
          <p className="py-6">
            Discover a world of comfort and adventure. We offer a curated
            selection of unique homes, from city apartments to countryside
            retreats.
          </p>
          <Link href="/properties" className="btn btn-primary">
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
