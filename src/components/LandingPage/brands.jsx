import { Star, Shield, Zap, Flame, Crown, Diamond, ArrowRight, Info, Check, Cog, Heart } from 'lucide-react';

const BrandCard = ({ icon: Icon, name }) => (
  <div className="bg-light p-4 rounded text-center transition">
    <Icon
      className="mb-3 transition-transform"
      style={{
        width: '3rem',
        height: '3rem',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    />
    <p className="text-secondary fw-medium">{name}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, iconColor }) => (
  <div className="bg-light p-4 h-100">
    <div className="text-center mb-3">
      <Icon
        style={{ width: '3rem', height: '3rem', transition: 'transform 0.3s ease' }}
        className={`transition-transform ${iconColor}`}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      />
    </div>
    <h3 className="h4 text-center mb-3">{title}</h3>
    <p className="text-secondary text-center">{description}</p>
  </div>
);

const PartnersSection = () => {
  const brands = [
    { icon: Star, name: 'Brand One' },
    { icon: Shield, name: 'Brand Two' },
    { icon: Zap, name: 'Brand Three' },
    { icon: Flame, name: 'Brand Four' },
    { icon: Crown, name: 'Brand Five' },
    { icon: Diamond, name: 'Brand Six' },
  ];

  const features = [
    {
      icon: Check,
      title: 'Quality Assured',
      description: 'All our partner brands meet strict quality standards',
      iconColor: 'text-success',
    },
    {
      icon: Cog,
      title: 'Certified Products',
      description: '100% authentic and certified equipment',
      iconColor: 'text-primary',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Committed to customer satisfaction',
      iconColor: 'text-danger',
    },
  ];

  return (
    <section className="container py-5">
      {/* Partners Header */}
      <div className="text-center mb-5">
        <p className="text-warning fw-semibold mb-2">OUR PARTNERS</p>
        <h2 className="display-5 fw-bold text-dark mb-3">Trusted Brands We Carry</h2>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          We partner with the world's leading sports equipment manufacturers
        </p>
      </div>

      {/* Brands Grid */}
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4 mb-5">
        {brands.map((brand, index) => (
          <div className="col" key={index}>
            <BrandCard {...brand} />
          </div>
        ))}
      </div>

      {/* Partner CTA Section */}
      <div className="bg-dark rounded p-4 p-md-5 text-center mb-5">
        <h3 className="text-white display-6 fw-bold mb-3">Become Our Partner Brand</h3>
        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          Join our network of premium sports equipment manufacturers
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button className="btn btn-warning text-white d-inline-flex align-items-center gap-2">
            Partner With Us
            <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
          <button className="btn btn-outline-light d-inline-flex align-items-center gap-2">
            Learn More
            <Info style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>
      </div>

      {/* Quality Features */}
      <div className="row g-4 mt-4">
        {features.map((feature, index) => (
          <div className="col-md-4" key={index}>
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
