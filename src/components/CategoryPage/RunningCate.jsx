  // RunningCate.jsx
  export const RunningCate = () => {
    const runningProducts = [
      {
        name: 'Professional Running Shoes',
        image: '/path/to/running-shoes-image.jpg',
        rating: 4.5,
        price: 129.99,
        stock: 'In Stock'
      },
      // Add more running products...
    ];
  
    return (
      <Container className="py-4">
        <h2 className="mb-4">Premium running gear</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {runningProducts.map((product, idx) => (
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