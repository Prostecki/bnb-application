import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="hero min-h-[60vh] bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://images.unsplash.com/photo-1730653784025-2266f3baa0f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
          className="w-full lg:max-w-lg rounded-lg shadow-2xl"
          alt="Stockholm, Sweden"
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
