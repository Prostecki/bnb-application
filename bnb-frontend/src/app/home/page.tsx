import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-base-100">
      {/* Main Greeting Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold leading-tight">
              Your perfect stay, just a click away.
            </h1>
            <p className="py-6 text-lg">
              Discover a world of comfort and adventure. We offer a curated
              selection of unique homes, from city apartments to countryside
              retreats.
            </p>
            <Link href="/properties" className="btn btn-primary btn-lg">
              Start Exploring
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://picsum.photos/id/1062/800/600"
              className="rounded-lg shadow-2xl w-full"
              alt="Beautiful rental property"
            />
          </div>
        </div>
      </div>

      {/* Explore Property Types Section */}
      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Explore Our Stays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card bg-base-100 shadow-xl image-full group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <figure>
                <img
                  src="https://picsum.photos/id/1011/400/300"
                  alt="Entire Homes"
                  className="transition-transform duration-500 ease-in-out group-hover:scale-125"
                />
              </figure>
              <div className="card-body justify-center items-center text-center">
                <h3 className="card-title text-3xl font-bold text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]">
                  Entire Homes
                </h3>
              </div>
            </div>
            {/* Card 2 */}
            <div className="card bg-base-100 shadow-xl image-full group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <figure>
                <img
                  src="https://picsum.photos/id/103/400/300"
                  alt="Unique Stays"
                  className="transition-transform duration-500 ease-in-out group-hover:scale-125"
                />
              </figure>
              <div className="card-body justify-center items-center text-center">
                <h3 className="card-title text-3xl font-bold text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]">
                  Unique Stays
                </h3>
              </div>
            </div>
            {/* Card 3 */}
            <div className="card bg-base-100 shadow-xl image-full group cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
              <figure>
                <img
                  src="https://picsum.photos/id/237/400/300"
                  alt="Pets Allowed"
                  className="transition-transform duration-500 ease-in-out group-hover:scale-125"
                />
              </figure>
              <div className="card-body justify-center items-center text-center">
                <h3 className="card-title text-3xl font-bold text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]">
                  Pets Allowed
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-primary">
              <div className="text-left p-4">
                <h3 className="font-bold text-lg">1. Search</h3>
                <p>Find your perfect rental from our curated list of properties.</p>
              </div>
            </li>
            <li className="step step-primary">
              <div className="text-left p-4">
                <h3 className="font-bold text-lg">2. Book</h3>
                <p>Book your stay with our simple and secure checkout process.</p>
              </div>
            </li>
            <li className="step">
              <div className="text-left p-4">
                <h3 className="font-bold text-lg">3. Enjoy</h3>
                <p>Have an unforgettable experience at your home away from home.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
