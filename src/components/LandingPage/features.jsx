import { Check, Medal, Users, Truck, Headphones } from 'lucide-react';

const StatsItem = ({ value, label }) => (
  <div className="d-flex flex-column mb-4">
    <div className="d-flex align-items-center gap-2">
      <div className="bg-warning" style={{ width: '4px', height: '32px' }}></div>
      <div>
        <h3 className="h5 fw-bold">{value}</h3>
        <p className="text-secondary mb-0">{label}</p>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="card border-0 shadow-sm p-4 mb-4 bg-light">
    <div
      className={`bg-white rounded-circle d-flex align-items-center justify-content-center mb-3`}
      style={{
        width: '48px',
        height: '48px',
        color:
          title === 'Quality First'
            ? '#FF7F0E'
            : title === 'Expert Team'
            ? '#007BFF'
            : title === 'Fast Delivery'
            ? '#28A745'
            : '#6F42C1',
      }}
    >
      <Icon size={24} />
    </div>
    <h5 className="card-title fw-semibold">{title}</h5>
    <p className="card-text text-secondary">{description}</p>
  </div>
);

const Features = () => {
  const stats = [
    { value: '10+ Years', label: 'Market Experience' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '500+', label: 'Products' },
    { value: '24/7', label: 'Customer Support' },
  ];

  const features = [
    { icon: Medal, title: 'Quality First', description: 'Only the best sports equipment makes it to our shelves' },
    { icon: Users, title: 'Expert Team', description: 'Professional guidance for your sports journey' },
    { icon: Truck, title: 'Fast Delivery', description: 'Quick and reliable shipping worldwide' },
    { icon: Headphones, title: '24/7 Support', description: 'Always here to help you succeed' },
  ];

  const benefits = [
    'Premium Quality Equipment',
    'Expert Customer Service',
    'Fast & Free Shipping',
    '100% Satisfaction Guarantee',
  ];

  return (
    <div className="container py-5">
      <div className="row gy-5">
        {/* Left Column */}
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold mb-4">
            Empowering Athletes with Premium Sports Equipment
          </h1>
          <p className="text-secondary mb-4">
            We're passionate about providing high-quality sports equipment that helps athletes achieve 
            their full potential. With over a decade of experience, SPOEQ has become a trusted name 
            in sports equipment retail.
          </p>

          {/* Stats Grid */}
          <div className="row row-cols-2 g-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="col">
                <StatsItem {...stat} />
              </div>
            ))}
          </div>

          {/* Benefits List */}
          <ul className="list-unstyled">
            {benefits.map((benefit, index) => (
              <li key={index} className="d-flex align-items-center mb-2">
                <Check className="text-success me-2" size={20} />
                <span className="text-secondary">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Feature Cards */}
        <div className="col-lg-6">
          <div className="row row-cols-1 row-cols-sm-2 g-4">
            {features.map((feature, index) => (
              <div key={index} className="col">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex gap-3 mt-5">
        <button className="btn btn-warning text-white px-4 py-2 fw-bold">
          Learn More
        </button>
        <button className="btn btn-dark px-4 py-2 fw-bold">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default Features;
