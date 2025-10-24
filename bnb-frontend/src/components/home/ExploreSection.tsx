export default function ExploreSection() {
  return (
    <div className="bg-base-200 py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Explore Our Stays
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="card bg-base-100 shadow-xl image-full">
            <figure>
              <img
                src="https://picsum.photos/id/1011/400/300"
                alt="Entire Homes"
              />
            </figure>
            <div className="card-body justify-center items-center">
              <h3 className="card-title text-3xl font-bold text-white">
                Entire Homes
              </h3>
            </div>
          </div>
          {/* Card 2 */}
          <div className="card bg-base-100 shadow-xl image-full">
            <figure>
              <img
                src="https://picsum.photos/id/103/400/300"
                alt="Unique Stays"
              />
            </figure>
            <div className="card-body justify-center items-center">
              <h3 className="card-title text-3xl font-bold text-white">
                Unique Stays
              </h3>
            </div>
          </div>
          {/* Card 3 */}
          <div className="card bg-base-100 shadow-xl image-full">
            <figure>
              <img
                src="https://picsum.photos/id/237/400/300"
                alt="Pets Allowed"
              />
            </figure>
            <div className="card-body justify-center items-center">
              <h3 className="card-title text-3xl font-bold text-white">
                Pets Allowed
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
