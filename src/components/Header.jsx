import React from 'react';

function Header() {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="h3 mb-0">E-Shop</div>
        <nav>
          <ul className="nav">
            <li className="nav-item"><a className="nav-link text-white" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="/products">Products</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="/cart">Cart</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="/login">Login</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;