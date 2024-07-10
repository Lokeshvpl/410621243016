import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
const ProductListingPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filters, setFilters] = useState({
      category: 'all',
      company: 'all',
      rating: 0,
      priceRange: { min: 0, max: Infinity },
      availability: true,
    });
    const [sortBy, setSortBy] = useState('price');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
  
    useEffect(() => {
      // Fetch product data from the APIs
      const fetchProducts = async () => {
        const response = await axios.get('/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
  
        // Get unique categories and companies
        const uniqueCategories = [...new Set(response.data.map((product) => product.category))];
        const uniqueCompanies = [...new Set(response.data.map((product) => product.company))];
        setCategories(uniqueCategories);
        setCompanies(uniqueCompanies);
      };
      fetchProducts();
    }, []);
  
    useEffect(() => {
      // Filter and sort the products based on the selected filters and sort order
      const filteredProducts = products.filter((product) => {
        return (
          (filters.category === 'all' || product.category === filters.category) &&
          (filters.company === 'all' || product.company === filters.company) &&
          product.rating >= filters.rating &&
          product.price >= filters.priceRange.min &&
          product.price <= filters.priceRange.max &&
          (filters.availability ? product.availability : true)
        );
      });
  
      filteredProducts.sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discount - a.discount;
        return 0;
      });
  
      setFilteredProducts(filteredProducts);
    }, [products, filters, sortBy]);
  
    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <div>
        <h1>Top N Products</h1>
        {/* Filters and sorting */}
        {/* Product list */}
        {currentProducts.map((product) => (
          <div key={product.uniqueIdentifier}>
            <Link to={/product/${product.uniqueIdentifier}}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Company: {product.company}</p>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price}</p>
              <p>Rating: {product.rating}</p>
              <p>Discount: {product.discount}%</p>
              <p>Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
            </Link>
          </div>
        ))}
        {/* Pagination */}
      </div>
    );
  };
  
  // Product Details Page
  const ProductDetailsPage = ({ match }) => {
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      // Fetch the product details using the unique identifier
      const fetchProductDetails = async () => {
        const response = await axios.get(/api/products/${match.params.id});
        setProduct(response.data);
      };
      fetchProductDetails();
    }, [match.params.id]);
  
    if (!product) return <div>Loading...</div>;
  
    return (
      <div>
        <h1>{product.name}</h1>
        <img src={product.imageUrl} alt={product.name} />
        <p>Company: {product.company}</p>
        <p>Category: {product.category}</p>
        <p>Price: ${product.price}</p>
        <p>Rating: {product.rating}</p>
        <p>Discount: {product.discount}%</p>
        <p>Availability: {product.availability ? 'In Stock' : 'Out of Stock'}</p>
      </div>
    );
  };
  
  // App
  const App = () => {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Product Listing</Link>
              </li>
            </ul>
          </nav>
  
          <Switch>
            <Route path="/product/:id">
              <ProductDetailsPage />
            </Route>
            <Route path="/">
              <ProductListingPage />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  };
  
  export default App;