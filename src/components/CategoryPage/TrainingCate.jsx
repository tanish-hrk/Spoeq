export const TrainingCate = () => {
    const trainingProducts = [
      {
        name: 'Training Dumbbells Set',
        image: '/path/to/dumbbells-image.jpg',
        rating: 4.5,
        price: 89.99,
        stock: 'Low Stock'
      },
      // Add more training products...
    ];
  
    return (
      <Container className="py-4">
        <h2 className="mb-4">Personal training essentials</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {trainingProducts.map((product, idx) => (
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