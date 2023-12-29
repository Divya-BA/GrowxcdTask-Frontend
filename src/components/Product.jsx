import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Dropdown from "react-bootstrap/Dropdown";
import { MdStarOutline } from "react-icons/md";

const ProductList = ({ addToCart, searchTerm, notify }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOfferType, setSelectedOfferType] = useState("all");
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/offers");
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error.message);
      }
    };

    fetchOffers();
  }, []);

  // Combine products and offers based on a common identifier (e.g., product ID)
  const productsWithOffers = products.map((product) => {
    const offer = offers.find((offer) => offer.product === product._id);
    return { ...product, offer };
  });

  // Filter products based on the selected offer type and search term
  const filteredProducts = productsWithOffers.filter((product) => {
    const matchesSearchTerm =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.offer &&
        product.offer.offerType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    const matchesOfferType =
      selectedOfferType === "all" ||
      (product.offer && product.offer.offerType === selectedOfferType) ||
      (selectedOfferType === "no-offers" && !product.offer);
    return matchesSearchTerm && matchesOfferType;
  });

  // Calculate the indexes of the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(filteredProducts.length / productsPerPage)
      )
    );
  };

  // Handle dropdown selection
  const handleDropdownSelect = (offerType) => {
    setSelectedOfferType(offerType);
  };

  return (
    <div className="container mt-4">

      <h2>All Products</h2>

      {/* Dropdown for offer types */}
      <Dropdown onSelect={handleDropdownSelect} className="dropdown">
        <Dropdown.Toggle variant="warning" id="dropdown-offer-type">
          Filter by Offer Type
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item eventKey="all">All Products</Dropdown.Item>
          <Dropdown.Item eventKey="flat">Flat Offer</Dropdown.Item>
          <Dropdown.Item eventKey="percentage">Percentage Offer</Dropdown.Item>
          <Dropdown.Item eventKey="free">Buy 1 Get 1</Dropdown.Item>
          <Dropdown.Item eventKey="no-offers">No Offers</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <div className="row">
        {currentProducts.map((product) => (
          <div key={product._id} className="col-md-4 mb-4">
            <Card
              border="warning"
              style={{ width: "25rem", position: "relative" }}
            >
              {product.offer && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "red",
                    color: "white",
                    padding: "0.5rem",
                    borderTopLeftRadius: "0.25rem",
                  }}
                >
                  {product.offer.offerType === "flat" &&
                    `Flat ₹${product.offer.discountValue} off`}
                  {product.offer.offerType === "percentage" &&
                    `${product.offer.discountValue}% off`}
                  {product.offer.offerType === "free" && "Buy 1 Get 1"}
                </div>
              )}
              <Card.Img
                variant="top"
                src={product.photos}
                alt={product.name}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text> Price: ₹{product.price}</Card.Text>
                <p className="rating">
                  <MdStarOutline className="star-icon" />
                  {product.rating}
                </p>
                <Button
                  variant="warning"
                  onClick={() => {
                    addToCart(product);
                    notify(`${product.name} added to cart`, "add");
                  }}
                >
                  {" "}
                  Add to Cart
                </Button>{" "}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
        {[
          ...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys(),
        ].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(filteredProducts.length / productsPerPage)
          }
        />
      </Pagination>
    </div>
  );
};

export default ProductList;
