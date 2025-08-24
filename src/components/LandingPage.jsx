/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import { mockTestimonials } from '../lib/mockProducts';
import CategoryRail from './rails/CategoryRail';
import ProductRail from './rails/ProductRail';

// Re-imagined eco-friendly landing page using Tailwind (replaces mixed Bootstrap styles)

const Section = ({ id, children, className='' }) => (
  <section id={id} className={'relative py-20 sm:py-28 '+className}>{children}</section>
);

const GradientTitle = ({ children, className='' }) => (
  <h2 className={'text-3xl md:text-4xl font-black tracking-tight mb-8 bg-gradient-to-r from-eco-leaf via-eco-moss to-eco-grass bg-clip-text text-transparent '+className}>{children}</h2>
);

// product card removed (using ProductRail items instead)

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className='relative min-h-[80vh] pt-20 flex items-center'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(46,125,50,0.35),transparent_60%)]'></div>
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6),rgba(0,0,0,0.92))]'></div>
      <div className='relative max-w-6xl mx-auto px-6'>
        <div className='max-w-2xl'>
          <h1 className='text-5xl md:text-6xl font-black leading-tight tracking-tight bg-gradient-to-br from-eco-grass via-eco-leaf to-eco-moss bg-clip-text text-transparent'>Elevate Your Game Sustainably</h1>
          <p className='mt-6 text-neutral-300 text-lg md:text-xl leading-relaxed'>Premium performance gear engineered with eco-conscious materials. Built for athletes who care about speed, resilience, and the planet.</p>
          <div className='mt-10 flex flex-wrap gap-4'>
            <button onClick={()=> navigate('/products')} className='btn btn-gradient bg-eco-moss hover:bg-eco-leaf text-neutral-900 font-semibold shadow-glow'>Shop Collection</button>
            <button onClick={()=> navigate('/products?q=running')} className='btn btn-outline border-eco-grass text-eco-grass hover:bg-eco-grass/10'>Running Gear</button>
            <button onClick={()=> navigate('/products?q=fitness')} className='btn btn-outline border-neutral-700 text-neutral-300 hover:border-eco-grass hover:text-white'>Fitness</button>
          </div>
          <div className='mt-12 grid grid-cols-3 gap-6 max-w-md text-center'>
            <Stat number='500+' label='Products' />
            <Stat number='50K+' label='Athletes' />
            <Stat number='98%' label='Satisfaction' />
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ number, label }) => (
  <div className='flex flex-col'>
    <span className='text-xl font-bold text-eco-grass'>{number}</span>
    <span className='text-[11px] uppercase tracking-wide text-neutral-500'>{label}</span>
  </div>
);

// removed deprecated sections in favor of Flipkart-like rails

const Testimonials = () => (
  <Section id='voices' className='bg-neutral-950/70'>
    <div className='max-w-6xl mx-auto px-6'>
      <GradientTitle>Athlete Voices</GradientTitle>
      <div className='grid md:grid-cols-3 gap-6'>
        {mockTestimonials.map(t=> (
          <div key={t.id} className='rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col'>
            <div className='text-amber-400 text-xs mb-3'>{'★'.repeat(Math.round(t.rating))}</div>
            <p className='text-sm text-neutral-300 leading-relaxed flex-1'>“{t.quote}”</p>
            <div className='mt-4 text-[11px] font-semibold text-eco-grass'>{t.name} • {t.sport}</div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const CTA = () => (
  <Section id='cta' className='py-24'>
    <div className='max-w-4xl mx-auto px-6 text-center'>
      <h2 className='text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-eco-leaf via-eco-grass to-eco-moss bg-clip-text text-transparent mb-6'>Gear Up • Go Further • Stay Green</h2>
      <p className='text-neutral-300 max-w-2xl mx-auto mb-10'>Join thousands of athletes choosing performance without compromise. Limited drops, sustainable builds, uncompromised speed.</p>
      <div className='flex flex-wrap gap-4 justify-center'>
        <Link to='/products' className='btn btn-gradient bg-eco-moss hover:bg-eco-leaf text-neutral-900 font-semibold shadow-glow'>Start Shopping</Link>
        <Link to='/register' className='btn btn-outline border-eco-grass text-eco-grass hover:bg-eco-grass/10'>Create Account</Link>
      </div>
    </div>
  </Section>
);

function LandingPage(){
  return (
    <div className='relative'>
      <Hero />
      {/* Flipkart-like category strip */}
      <CategoryRail />
      {/* Promo cards row (placeholder) */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 my-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='h-36 rounded-xl bg-gradient-to-r from-eco-fern to-eco-grass border border-eco-grass/30'></div>
        <div className='h-36 rounded-xl bg-gradient-to-r from-eco-grass to-eco-moss border border-eco-grass/30'></div>
        <div className='h-36 rounded-xl bg-gradient-to-r from-eco-leaf to-eco-fern border border-eco-grass/30'></div>
      </section>
      {/* Product rails */}
      <ProductRail title='Top Rated' query={{ limit: 12, sort: '-ratingAvg' }} />
      <ProductRail title='New Arrivals' query={{ limit: 12, sort: '-createdAt' }} />
      <Testimonials />
      <CTA />
    </div>
  );
}

export default LandingPage;
