/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

const defaultCats = [
  { key: 'fitness', label: 'Fitness' },
  { key: 'running', label: 'Running' },
  { key: 'training', label: 'Training' },
  { key: 'team', label: 'Team Sports' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'outdoor', label: 'Outdoor' }
];

export default function CategoryRail({ categories = defaultCats }){
  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 my-4'>
      <div className='grid grid-cols-3 sm:grid-cols-6 gap-3'>
        {categories.map(c=> (
          <Link key={c.key} to={'/products?q='+c.key} className='rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 hover:shadow transition flex items-center justify-center text-sm font-medium'>
            {c.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
