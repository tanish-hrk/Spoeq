import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to add/remove blur effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      className={`py-1 ${
        isScrolled
          ? "bg-dark bg-opacity-75 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      } fixed-top transition-all`}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand href="#" className="fs-3 fw-bold text-warning">
          SPOEQ
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-warning px-1 py-0 opacity-35" />

        {/* Navigation Links and Search */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main Navigation */}
          <Nav className="mx-auto">
            <Nav.Link href="#" className="mx-2 text-white hover-text-warning">
              Home
            </Nav.Link>
            <Nav.Link href="#" className="mx-2 text-white hover-text-warning">
              Shop
            </Nav.Link>
            <Nav.Link href="#" className="mx-2 text-white hover-text-warning">
              About Us
            </Nav.Link>
            <Nav.Link href="#" className="mx-2 text-white hover-text-warning">
              Testimonial
            </Nav.Link>
            <Nav.Link href="#" className="mx-2 text-white hover-text-warning">
              Contact Us
            </Nav.Link>
          </Nav>

          {/* Search and Icons */}
          <div className="d-flex align-items-center gap-3">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search products ..."
                className="me-2 bg-white opacity-25 text-white border-0"
                aria-label="Search"
              />
              <Button
                variant="outline-warning"
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>

            <Button variant="link" className="text-white px-2">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Button>
            <Button variant="link" className="text-white px-2">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
