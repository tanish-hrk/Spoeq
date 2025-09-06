import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Subscribe = () => {
  const [email, setEmail] = useState('');

  return (
    <Container className="py-5 bg-success my-5 text-white" style={{ backgroundColor: '#ff6b24', borderRadius: '10px', opacity: '0.9' }}>
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <i className="fas fa-shopping-bag mb-3 fs-1"></i>
          <h2 className="mb-3">Stay in the Game!</h2>
          <p className="mb-4">
            Subscribe to our newsletter for exclusive deals, new arrivals, and expert tips
          </p>
          <Form className="d-flex justify-content-center gap-2">
            <Form.Control
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-50"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', border: 'none' }}
            />
            <Button variant="light" className="px-4">
              Subscribe Now →
            </Button>
          </Form>
          <div className="mt-3 d-flex justify-content-center gap-4">
            <span>✓ Exclusive Offers</span>
            <span>✓ New Arrivals</span>
            <span>✓ Training Tips</span>
            <span>✓ Early Access</span>
          </div>
          <small className="mt-3 d-block">
            By subscribing, you agree to our Privacy Policy and Terms of Service
          </small>
        </Col>
      </Row>
    </Container>
  );
};

export default Subscribe;