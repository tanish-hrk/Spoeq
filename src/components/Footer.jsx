// Footer.jsx
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const navLinks = {
    quickLinks: [
      { text: 'Home', href: '#' },
      { text: 'Shop', href: '#' },
      { text: 'About Us', href: '#' },
      { text: 'Contact', href: '#' },
      { text: 'Blog', href: '#' }
    ],
    customerService: [
      { text: 'Track Order', href: '#' },
      { text: 'Shipping Policy', href: '#' },
      { text: 'Returns & Exchanges', href: '#' },
      { text: 'FAQs', href: '#' },
      { text: 'Size Guide', href: '#' }
    ]
  };

  const socialIcons = [
    { icon: faFacebookF, href: '#' },
    { icon: faTwitter, href: '#' },
    { icon: faInstagram, href: '#' },
    { icon: faYoutube, href: '#' }
  ];

  return (
    <footer className="py-5" style={{ backgroundColor: '#16181F' }}>
      <Container>
        <Row className="g-4">
          {/* Brand Column */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h2 className="text-white fs-3 fw-bold mb-3">SPOEQ</h2>
            <p className="text-gray-400 mb-4" style={{ color: '#94969A' }}>
              Your premier destination for quality sports equipment and gear.
            </p>
            <div className="d-flex gap-3">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover-text-white transition-colors"
                  style={{ color: '#94969A' }}
                >
                  <FontAwesomeIcon icon={social.icon} size="lg" />
                </a>
              ))}
            </div>
          </Col>

          {/* Quick Links Column */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h3 className="text-white fs-5 fw-semibold mb-4">Quick Links</h3>
            <ul className="list-unstyled mb-0">
              {navLinks.quickLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={link.href}
                    className="text-decoration-none"
                    style={{ color: '#94969A' }}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Customer Service Column */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h3 className="text-white fs-5 fw-semibold mb-4">Customer Service</h3>
            <ul className="list-unstyled mb-0">
              {navLinks.customerService.map((link, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={link.href}
                    className="text-decoration-none"
                    style={{ color: '#94969A' }}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          {/* Newsletter Column */}
          <Col lg={3} md={6}>
            <h3 className="text-white fs-5 fw-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4" style={{ color: '#94969A' }}>
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent border-secondary text-white"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </Form.Group>
              <Button 
                variant="primary" 
                className="w-100"
                style={{
                  backgroundColor: '#2563EB',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px'
                }}
              >
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <Row className="align-items-center">
          <Col lg={6} className="mb-3 mb-lg-0">
            <p className="text-gray-400 mb-0" style={{ color: '#94969A' }}>
              © 2024 SPOEQ. All rights reserved.
            </p>
          </Col>
          <Col lg={6}>
            <div className="d-flex justify-content-lg-end gap-3">
              <a href="#" className="text-gray-400" style={{ color: '#94969A' }}>
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400" style={{ color: '#94969A' }}>
                Terms of Service
              </a>
              <a href="#" className="text-gray-400" style={{ color: '#94969A' }}>
                Cookie Policy
              </a>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="d-flex justify-content-end gap-2">
            <img src="/api/placeholder/40/25" alt="Mastercard" style={{ opacity: 0.7 }} />
            <img src="/api/placeholder/40/25" alt="PayPal" style={{ opacity: 0.7 }} />
            <img src="/api/placeholder/40/25" alt="Apple Pay" style={{ opacity: 0.7 }} />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;