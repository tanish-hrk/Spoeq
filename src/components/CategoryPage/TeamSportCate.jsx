export const TeamSportCate = () => {
    const teamSportProducts = [
      {
        name: 'Pro Basketball',
        image: '/path/to/basketball-image.jpg',
        rating: 4,
        price: 29.99,
        stock: 'In Stock',
        badge: 'Hot',
        badgeColor: 'warning'
      },
      // Add more team sports products...
    ];
  
    return (
      <Container className="py-4">
        <h2 className="mb-4">Equipment for every game</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {teamSportProducts.map((product, idx) => (
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