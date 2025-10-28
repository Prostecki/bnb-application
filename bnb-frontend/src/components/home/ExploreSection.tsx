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
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
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
                src="https://images.unsplash.com/photo-1758311178620-749d33c6ff29?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1932"
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
                src="https://images.unsplash.com/photo-1551887373-3c5bd224f6e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGV0JTIwZnJpZW5kbHl8ZW58MHwwfDB8fHww&auto=format&fit=crop&q=60&w=500"
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
