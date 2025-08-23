import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockFeaturedProducts, mockCategorySpotlight, mockTestimonials, mockBadges } from '../lib/mockProducts';

// Re-imagined eco-friendly landing page using Tailwind (replaces mixed Bootstrap styles)

const Section = ({ id, children, className='' }) => (
  <section id={id} className={'relative py-20 sm:py-28 '+className}>{children}</section>
);

const GradientTitle = ({ children, className='' }) => (
  <h2 className={'text-3xl md:text-4xl font-black tracking-tight mb-8 bg-gradient-to-r from-eco-leaf via-eco-moss to-eco-grass bg-clip-text text-transparent '+className}>{children}</h2>
);

const ProductCard = ({ p }) => {
  return (
    <Link to={'/products/'+p.id} className='group relative flex flex-col rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 transition shadow-glow/0 hover:shadow-glow'>
      {p.badge && <span className={'absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full font-semibold tracking-wide '+ (mockBadges[p.badge]||'bg-neutral-800 text-white')}>{p.badge}</span>}
      <div className='aspect-square flex items-center justify-center text-neutral-600 text-xs bg-neutral-800/60'>IMG</div>
      <div className='p-4 flex flex-col flex-1'>
        <div className='text-[11px] uppercase tracking-wider text-eco-fern mb-1'>{p.brand}</div>
        <div className='font-semibold text-neutral-100 group-hover:text-white line-clamp-2 mb-2'>{p.name}</div>
        <div className='mt-auto flex items-baseline gap-2'>
          <span className='text-lg font-bold text-eco-grass'>₹{p.price.sale}</span>
          {p.price.mrp && <span className='text-xs line-through text-neutral-500'>₹{p.price.mrp}</span>}
        </div>
        <div className='text-[10px] text-amber-400 mt-1'>★ {p.rating} <span className='text-neutral-500'>({p.ratingCount})</span></div>
      </div>
    </Link>
  );
};

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

const CategoriesSpotlight = () => (
  <Section id='spotlights' className='bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950'>
    <div className='max-w-6xl mx-auto px-6'>
      <GradientTitle>Performance Ecosystems</GradientTitle>
      <div className='grid md:grid-cols-3 gap-6'>
        {mockCategorySpotlight.map(c=> (
          <div key={c.key} className='relative rounded-2xl overflow-hidden border border-neutral-800 group'>
            <div className={'absolute inset-0 bg-gradient-to-br '+c.gradient+' pointer-events-none'}></div>
            <div className='p-6 relative flex flex-col min-h-[220px]'>
              <h3 className='font-semibold text-lg text-neutral-100 mb-2'>{c.title}</h3>
              <p className='text-sm text-neutral-400 leading-relaxed'>{c.blurb}</p>
              <Link to={'/products?q='+c.key} className='mt-auto text-[11px] tracking-wide font-semibold text-eco-grass group-hover:underline'>Explore →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

const FeaturedProducts = () => (
  <Section id='featured'>
    <div className='max-w-6xl mx-auto px-6'>
      <div className='flex items-center justify-between mb-4'>
        <GradientTitle className='mb-0'>Featured Gear</GradientTitle>
        <Link to='/products' className='text-xs text-eco-grass hover:underline'>View all</Link>
      </div>
      <div className='grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {mockFeaturedProducts.map(p=> <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  </Section>
);

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
      <FeaturedProducts />
      <CategoriesSpotlight />
      <Testimonials />
      <CTA />
    </div>
  );
}

export default LandingPage;
