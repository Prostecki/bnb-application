import Image from "next/image";
import Rating from "../rating/Rating";

interface overallPointsInterface {
  id: number;
  rating: number;
}

const overallPoints: overallPointsInterface[] = [
  { id: 5, rating: 4.5 },
  { id: 4, rating: 4.0 },
  { id: 3, rating: 0 },
  { id: 2, rating: 0 },
  { id: 1, rating: 0 },
];

const ratings = [
  { name: "Cleanliness", grade: 4.9, icon: "/cleanliness.png" },
  { name: "Accuracy", grade: 4.8, icon: "/accuracy.png" },
  { name: "Check-in", grade: 4.9, icon: "/check-in-icon.png" },
  { name: "Communication", grade: 5.0, icon: "/communication-icon.png" },
  { name: "Location", grade: 4.9, icon: "/location-icon.png" },
  { name: "Value", grade: 4.8, icon: "/value-icon.png" },
];

const PropertyRatings = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="text-center py-12">
        <div className="flex flex-col">
          <div className="flex justify-center items-center">
            <Image
              width={120}
              height={183}
              src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png?im_w=240"
              alt="Guest Favorite Badge Left"
            />
            <div className="stat-value font-[600] text-8xl mb-10">4.94</div>
            <Image
              width={120}
              height={183}
              src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png?im_w=240"
              alt="Guest Favorite Badge Right"
            />
          </div>
          <div className="text-black font-[600] mb-5 text-2xl">
            <p>Guest favorite</p>
          </div>
          <div className="text-lg text-gray-600/80 mb-5">
            <p>
              This home is in the top 10% of eligible listings based on ratings,
              reviews, and reliability
            </p>
          </div>
        </div>
        <div className="stats stats-vertical lg:stats-horizontal shadow w-[80%] mt-4">
          <div className="flex flex-col gap-2 px-4">
            <p className="font-semibold text-left">Overall rating</p>
            {overallPoints.map((point) => (
              <div key={point.id} className="flex gap-2 items-center">
                <label htmlFor={point.id.toString()}>{point.id}</label>
                <Rating rating={point.rating} />
              </div>
            ))}
          </div>
          {ratings.map((rating) => (
            <div
              className="stat flex flex-col justify-start items-start gap-2"
              key={rating.name}
            >
              <div className="stat-title text-lg">{rating.name}</div>
              <div className="stat-value font-[600] text-2xl">
                {rating.grade}
              </div>
              <div className="text-secondary">
                <div className="w-10 h-10 relative">
                  <Image
                    src={rating.icon}
                    alt={`${rating.name} icon`}
                    layout="fill"
                    objectFit="contain"
                    sizes="40px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyRatings;
