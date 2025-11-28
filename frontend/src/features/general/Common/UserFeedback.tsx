import { CheckCircle, Star } from 'lucide-react'
import React from 'react'
const UserFeedback = () => {

      const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b882?w=150&h=150&fit=crop&crop=face",
      quote: "Stratify transformed our business operations. The AI insights are incredible and saved us 40% in operational costs."
    },
    {
      name: "Michael Chen",
      role: "CTO, InnovateNow",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "The real-time collaboration features are game-changing. Our team productivity increased by 60% within the first month."
    },
    {
      name: "Emily Rodriguez",
      role: "VP Operations, GrowthLab",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Best investment we've made. The analytics dashboard gives us insights we never had before. Highly recommend!"
    }
  ]
  return (
      <div className="mt-16 sm:mt-20 lg:mt-24 mb-16 ps-16 pe-16">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              What Our Customers Say
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Don't just take our word for it - hear from the businesses transforming with Stratify
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-100 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      
  )
}

export default UserFeedback