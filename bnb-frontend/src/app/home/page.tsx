import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Main Greeting Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Your perfect stay, just a click away.
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Discover a world of comfort and adventure. We offer a curated
              selection of unique homes, from city apartments to countryside
              retreats.
            </p>
            <Link
              href="/properties"
              className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Exploring
            </Link>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://picsum.photos/id/1062/800/600"
              className="rounded-lg shadow-xl w-full"
              alt="Beautiful rental property"
            />
          </div>
        </div>
      </div>

      {/* Explore Property Types Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Explore Our Stays
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://picsum.photos/id/1011/400/300"
                alt="Entire Homes"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Entire Homes
                </h3>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://picsum.photos/id/103/400/300"
                alt="Unique Stays"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Unique Stays
                </h3>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://picsum.photos/id/237/400/300"
                alt="Pets Allowed"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Pets Allowed
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-2">Search</h3>
              <p className="text-gray-600">
                Find your perfect rental from our curated list of properties.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-2">Book</h3>
              <p className="text-gray-600">
                Book your stay with our simple and secure checkout process.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-200 text-gray-700 rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-2">Enjoy</h3>
              <p className="text-gray-600">
                Have an unforgettable experience at your home away from home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
