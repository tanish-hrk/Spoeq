import React, { useEffect, useState } from 'react';
import { Star, StarHalf, ShoppingCart, Heart } from 'lucide-react';
import axios from 'axios';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="text-warning" style={{ width: '16px', height: '16px' }} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half-star" className="text-warning" style={{ width: '16px', height: '16px' }} />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-muted" style={{ width: '16px', height: '16px' }} />
      );
    }

    return stars;
  };

  return (
    <div className="card border-0 shadow-sm rounded-lg p-3" style={{ minWidth: '280px', maxWidth: '320px' }}>
      {product.badge && (
        <span
          className={`badge position-absolute top-0 start-0 m-3 px-3 py-1 ${
            product.badge === 'New'
              ? 'bg-success'
              : product.badge === 'Hot'
              ? 'bg-warning'
              : 'bg-danger'
          } text-white`}
        >
          {product.badge}
        </span>
      )}
      <button className="btn position-absolute top-0 end-0 m-3 p-2 bg-white border-0 shadow-sm rounded-circle">
        <Heart className="text-muted" style={{ width: '20px', height: '20px' }} />
      </button>
      <div
        className="rounded bg-light mb-3"
        style={{
          height: '200px',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <h5 className="card-title">{product.name}</h5>
      <div className="d-flex align-items-center gap-1 mb-2">
        {renderStars(product.rating)}
        <span className="text-muted ms-1">({product.rating})</span>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {product.originalPrice && (
          <span className="text-decoration-line-through text-muted">${product.originalPrice}</span>
        )}
        <span className="fw-bold fs-5">${product.price}</span>
        <span
          className={`badge ${
            product.stock === 'Low Stock' ? 'text-danger' : 'text-success'
          }`}
        >
          {product.stock}
        </span>
      </div>
      <button className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2">
        <ShoppingCart style={{ width: '20px', height: '20px' }} />
        Add to Cart
      </button>
    </div>
  );
};

const BestSellers = () => {
  const [data,Setdata] = useState()
  useEffect(() => {
    const fetch = async()=> {
      const res = await axios.get("http://localhost:5000/fetchproduct")
      Setdata(res.data.data)
      console.log(res)
    }
    fetch();
 }, [])
  


  return (
    <div className="container text-center py-5">
      <h1 className="display-5 fw-bold mb-3">Best Sellers</h1>
      <p className="text-muted mb-4">Our most popular products loved by athletes</p>
      <div className="row g-4 justify-content-center">
        {data?.map((product, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <button className="btn btn-dark mt-4">View All Sellers</button>
    </div>
  );
};

export default BestSellers;
