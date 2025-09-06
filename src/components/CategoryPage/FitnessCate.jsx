import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductCard from './ProductCard';

export const FitnessCate = () => {
    const fitnessProducts = [
      {
        name: 'Premium Yoga Mat',
        image: '/path/to/yoga-mat-image.jpg',
        rating: 4.5,
        oldPrice: 99.99,
        price: 79.99,
        stock: 'In Stock',
        discount: '-20%'
      },
      {
        name: 'Smart Fitness Watch',
        image: '/path/to/smart-watch-image.jpg',
        rating: 5,
        price: 149.99,
        stock: 'In Stock',
        badge: 'New',
        badgeColor: 'success'
      },
      // Add more fitness products...
    ];
  
    return (
      <Container className="py-4">
        <h2 className="mb-4">Our most popular fitness products</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {fitnessProducts.map((product, idx) => (
            <Col key={idx}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button variant="dark">View All Sellers</Button>
        </div>
      </Container>
    );
  };
  
