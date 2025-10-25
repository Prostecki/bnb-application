export default function HowItWorksSection() {
  return (
    <div className="py-20 bg-base-100">
      <div className="container mx-auto px-6">
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
          <li className="step step-primary">
            <div className="text-left p-4">
              <h3 className="font-bold text-lg">3. Enjoy</h3>
              <p>Have an unforgettable experience at your home away from home.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
