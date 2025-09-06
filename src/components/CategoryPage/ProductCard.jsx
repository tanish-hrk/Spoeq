import { Card, Button } from 'react-bootstrap';
import { Star, StarFill, Heart } from 'react-bootstrap-icons';

const ProductCard = ({ product }) => {
  return (
    <Card className="h-100">
      <div className="position-relative">
        {product.discount && (
          <div className="position-absolute top-0 start-0 bg-danger text-white px-2 m-2 rounded">
            {product.discount}
          </div>
        )}
        {product.badge && (
          <div className={`position-absolute top-0 start-0 bg-${product.badgeColor} text-white px-2 m-2 rounded`}>
            {product.badge}
          </div>
        )}
        <div className="position-absolute top-0 end-0 m-2">
          <Heart className="text-secondary" size={20} />
        </div>
        <Card.Img variant="top" src={product.image} className="img-fluid" />
      </div>
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <div className="mb-2">
          {[...Array(5)].map((_, index) => (
            index < Math.floor(product.rating) ? 
              <StarFill key={index} className="text-warning" /> : 
              <Star key={index} className="text-warning" />
          ))}
          <span className="ms-2 text-muted">({product.rating})</span>
        </div>
        <div className="d-flex align-items-center mb-3">
          {product.oldPrice && (
            <span className="text-muted text-decoration-line-through me-2">
              ${product.oldPrice}
            </span>
          )}
          <span className="fs-5 fw-bold">${product.price}</span>
          <span className={`ms-auto ${product.stock === 'Low Stock' ? 'text-danger' : 'text-success'}`}>
            {product.stock}
          </span>
        </div>
        <Button variant="dark" className="w-100">Add to Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;