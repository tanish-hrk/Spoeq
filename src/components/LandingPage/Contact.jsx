import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Contact = () => {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Contact SPOEQ</h2>
      <p className="text-center mb-5">We're here to help with your sports equipment needs</p>
      
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="contact-form p-4 bg-white shadow-sm rounded">
            <h3 className="mb-4">Send Us a Message</h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Your Name" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Your Email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" placeholder="Subject" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="Your Message" />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Send Message
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={4}>
          <div className="contact-info p-4 bg-white shadow-sm rounded">
            <h3 className="mb-4">Contact Information</h3>
            <div className="mb-3">
              <i className="fas fa-map-marker-alt me-2"></i>
              123 Sports Avenue, Athletic City, SP 12345
            </div>
            <div className="mb-3">
              <i className="fas fa-phone me-2"></i>
              +1 (555) 123-4567
            </div>
            <div className="mb-3">
              <i className="fas fa-envelope me-2"></i>
              info@spoeq.com
            </div>
            <div className="mb-4">
              <i className="fas fa-clock me-2"></i>
              Mon - Fri: 9:00 AM - 6:00 PM
            </div>
            <h4 className="mb-3">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="me-3"><i className="fab fa-facebook"></i></a>
              <a href="#" className="me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="me-3"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;