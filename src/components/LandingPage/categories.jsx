import img2 from '../../assets/pexels-rupinder-singh-2744173-11091136.jpg';
import img1 from '../../assets/pexels-photo-1552252.webp';
import img3 from '../../assets/pexels-photo-2468339.webp';
import img4 from '../../assets/pexels-photo-3309268.jpeg.jpg';
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: 'Fitness',
    description: 'Professional gym equipment',
    backgroundImage: img1,
    icon: '🏋️‍♂️',
    path: '/fitnessCate',
  },
  {
    name: 'Team Sports',
    description: 'Equipment for every game',
    backgroundImage: img2,
    icon: '🏈',
    path: '/teamSportsCate',
  },
  {
    name: 'Running',
    description: 'Premium running gear',
    backgroundImage: img4,
    icon: '🏃‍♂️',
    path: '/runningCate',
  },
  {
    name: 'Training',
    description: 'Personal training essentials',
    backgroundImage: img3,
    icon: '❤️',
    path: '/trainingCate',
  },
];

const CategoryCard = ({ name, description, backgroundImage, icon, path }) => {
  const navigate = useNavigate(); // Place `useNavigate` inside the component
  return (
    <div
      className="card text-white mb-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div className="card-body text-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="display-4 mb-3">{icon}</div>
        <h2 className="card-title mb-2">{name}</h2>
        <p className="card-text mb-4">{description}</p>
        <button className="btn btn-light" onClick={() => navigate(path)}>Shop Now</button>
      </div>
    </div>
  );
};

const FeaturedCategories = () => (
  <div className="text-center py-5">
    <h1 className="display-4 mb-4">Featured Categories</h1>
    <p className="lead mb-5">Discover our premium sports equipment collection</p>
    <div className="row gx-4 gy-4 justify-content-center">
      {categories.map((category) => (
        <div key={category.name} className="col-12 col-md-6 col-lg-3">
          <CategoryCard {...category} />
        </div>
      ))}
    </div>
    <button className="btn btn-dark mt-4">View All Categories</button>
  </div>
);

export default FeaturedCategories;
