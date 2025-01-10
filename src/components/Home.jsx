import React from 'react';

function Home() {
  return (
    <main className="container my-4">
      <section className="text-center mb-5">
        <div className="p-5 bg-light rounded">
          <h1>Welcome to E-Shop</h1>
          <p>Your one-stop shop for everything!</p>
        </div>
      </section>
      <section>
        <h2 className="text-center mb-4">Shop by Category</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
          <div className="col">
            <div className="p-3 bg-secondary text-white rounded text-center">Electronics</div>
          </div>
          <div className="col">
            <div className="p-3 bg-secondary text-white rounded text-center">Fashion</div>
          </div>
          <div className="col">
            <div className="p-3 bg-secondary text-white rounded text-center">Home & Kitchen</div>
          </div>
          <div className="col">
            <div className="p-3 bg-secondary text-white rounded text-center">Books</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;