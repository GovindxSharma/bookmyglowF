import React from "react";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Alice Johnson",
    rating: 5,
    comment:
      "Amazing service! The staff is super friendly and the salon ambiance is top-notch. Highly recommend!",
  },
  {
    name: "Michael Smith",
    rating: 4,
    comment:
      "Great haircuts and styling. Very professional team and clean environment.",
  },
  {
    name: "Sophie Lee",
    rating: 5,
    comment:
      "Best salon in the city! They really understand what suits you and deliver excellent results.",
  },
];

const ReviewCard = ({ review }) => (
  <div id="reviews" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-[#EBD6FB] flex flex-col gap-4 hover:shadow-xl transition-all duration-300">
    <div>
      <h4 className="font-semibold text-[#4E56B2]">{review.name}</h4>
      <div className="flex gap-1 text-[#C66A1F] mt-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>
    </div>
    <p className="text-[#2A2A2A]/90 text-sm sm:text-base">{review.comment}</p>
  </div>
);

const Reviews = () => {
  return (
    <section className="py-16 px-5 sm:px-10 md:px-16 bg-gradient-to-br from-[#F5F6FF] via-[#EBD6FB] to-[#E5EBFF]">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4E56B2]">
          What Our Clients Say
        </h2>
        <p className="text-[#2A2A2A]/80 mt-2 max-w-xl mx-auto text-sm sm:text-base">
          Hear from our happy clients and see why we are the best salon in the city.
        </p>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </section>
  );
};

export default Reviews;
