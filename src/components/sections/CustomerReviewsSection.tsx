'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const CustomerReviewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const reviews = [
    {
      name: "Adrian",
      review: "Investogold's precision trading is a game-changer, consistently delivering impressive profits. I trust it for my financial success.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Madison",
      review: "Effortless trading with Investogold. Its adaptability and data-driven approach make it a standout choice. Highly recommended!",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Schneider",
      review: "Seamless trades, constant profits - Investogold simplifies trading. It's a must-have for anyone in the market.",
      rating: 5,
      avatar: "👨‍🔬"
    },
    {
      name: "Tommy",
      review: "Investogold's innovative strategies and consistent returns have transformed my trading experience. It's a valuable asset to any trader.",
      rating: 4,
      avatar: "👨‍💻"
    },
    {
      name: "Jannet",
      review: "I rely on Investogold for its adaptability in fluctuating markets. It's a proven partner in achieving financial goals.",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Thomas",
      review: "Investogold's automated precision is remarkable. It's a powerful tool for navigating today's complex trading landscape.",
      rating: 4,
      avatar: "👨‍🚀"
    },
    {
      name: "Atlan",
      review: "Maximized profits with Investogold. Its results speak volumes. A reliable and intelligent trading companion.",
      rating: 5,
      avatar: "👨‍🎨"
    },
    {
      name: "Kelvin",
      review: "Trading with Investogold is effortless and rewarding. It adapts to market changes seamlessly. Truly impressive!",
      rating: 5,
      avatar: "👨‍🔧"
    },
    {
      name: "Jude",
      review: "Investogold has changed my trading game. Its data-driven approach delivers consistent gains. An invaluable tool for success.",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "Jake",
      review: "Effortless trading made possible by Investogold. Its strategic prowess sets it apart. A game-changer for traders.",
      rating: 5,
      avatar: "👨‍⚖️"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
  }, [reviews.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(reviews.length / 3)) % Math.ceil(reviews.length / 3));
  }, [reviews.length]);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  const getVisibleReviews = () => {
    const startIndex = currentSlide * 3;
    return reviews.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Customers Review
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Here is what our many users around the world are saying about our amazing
            product.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors border border-gray-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors border border-gray-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-8 mx-12">
            {getVisibleReviews().map((review, index) => (
              <div
                key={`${currentSlide}-${index}`}
                className="relative group"
              >
                {/* Colorful Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  index === 0 ? 'from-purple-400 to-pink-500' : 
                  index === 1 ? 'from-blue-400 to-indigo-500' : 
                  'from-green-400 to-teal-500'
                } rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                
                <div className={`relative bg-white rounded-2xl border-2 ${
                  index === 0 ? 'border-purple-200 hover:border-purple-400' : 
                  index === 1 ? 'border-blue-200 hover:border-blue-400' : 
                  'border-green-200 hover:border-green-400'
                } p-8 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-xl`}>
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4">
                    <Quote className={`w-8 h-8 ${
                      index === 0 ? 'text-purple-400' : 
                      index === 1 ? 'text-blue-400' : 
                      'text-green-400'
                    } opacity-50`} />
                  </div>

                  {/* Review Text */}
                  <div className="mb-6">
                    <p className="text-gray-700 leading-relaxed text-lg italic">
                      &ldquo;{review.review}&rdquo;
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {renderStars(review.rating)}
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${
                      index === 0 ? 'from-purple-500 to-pink-600' : 
                      index === 1 ? 'from-blue-500 to-indigo-600' : 
                      'from-green-500 to-teal-600'
                    } rounded-full flex items-center justify-center text-2xl mr-4 shadow-lg`}>
                      {review.avatar}
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold text-lg">{review.name}</h4>
                      <p className={`text-sm font-medium ${
                        index === 0 ? 'text-purple-600' : 
                        index === 1 ? 'text-blue-600' : 
                        'text-green-600'
                      }`}>Verified Customer</p>
                    </div>
                  </div>

                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    index === 0 ? 'from-purple-500/5 to-pink-600/5' : 
                    index === 1 ? 'from-blue-500/5 to-indigo-600/5' : 
                    'from-green-500/5 to-teal-600/5'
                  } rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
              <div className="text-gray-500">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10k+</div>
              <div className="text-gray-500">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-500">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-gray-500">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Section Footer */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500"></div>
            <span className="text-sm font-medium">GETTING STARTED</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
