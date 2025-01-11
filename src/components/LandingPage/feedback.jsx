import React from "react";

const Feedback = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Athlete",
      text: "The quality of sports equipment from SPOEQ is outstanding. Their customer service team went above and beyond to help me find the perfect gear for my training needs.",
      rating: 5,
    },
    {
      name: "Mike Thompson",
      role: "Fitness Trainer",
      text: "Fast shipping and excellent product range. I've been buying from SPOEQ for years and have never been disappointed. Their fitness equipment is top-notch!",
      rating: 4,
    },
    {
      name: "Emily Chen",
      role: "Team Coach",
      text: "The team sports equipment we ordered was perfect for our local club. Great prices, professional service, and durable products. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <div className="bg-dark text-white py-5">
      <div className="container">
        <h3 className="text-warning text-center fw-bold mt-4">TESTIMONIALS</h3>
        <h2 className="display-5 fw-bold text-center mb-4 mt-3">
          What Our Customers Say
        </h2>
        <p className="text-center text-muted mb-4">
          Don't just take our word for it – hear from our satisfied customers
        </p>
        
        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div className="col-md-4" key={index}>
              <div className="bg-secondary bg-opacity-25 p-4 rounded h-100 text-center">
                <p className="fs-5 fw-medium mb-3">"{testimonial.text}"</p>
                <h3 className="fs-5 fw-semibold">{testimonial.name}</h3>
                <p className="text-muted">{testimonial.role}</p>
                <div className="mt-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-warning">★</span>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-secondary">★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-warning text-white px-4 py-2">
            View All Reviews →
          </button>
        </div>

        <div className="row text-center mt-5 g-4">
          <div className="col-6 col-md-3">
            <h3 className="text-warning fw-bold fs-2">15K+</h3>
            <p className="text-muted">Happy Customers</p>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-warning fw-bold fs-2">4.8</h3>
            <p className="text-muted">Average Rating</p>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-warning fw-bold fs-2">95%</h3>
            <p className="text-muted">Satisfaction Rate</p>
          </div>
          <div className="col-6 col-md-3">
            <h3 className="text-warning fw-bold fs-2">24/7</h3>
            <p className="text-muted">Support Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;