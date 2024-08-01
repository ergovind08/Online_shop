import React, { Fragment } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./Product";
import MetaData from "../layout/MetaData";

// Sample product data
const product = {
  name: "Blue Tshirt",
  images: [{ url: "https://m.media-amazon.com/images/I/71pNnnaOIzS._AC_UY1100_.jpg" }],
  price: "3000",
  _id: "Vikash",
};

const Home = () => {
  return (
    <Fragment>
      <MetaData title="Online Shop" />
      
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>

      <h2 className="homeHeading">Featured Products</h2>
      
      <div className="container" id="container">
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
      </div>
    </Fragment>
  );
};

export default Home;
