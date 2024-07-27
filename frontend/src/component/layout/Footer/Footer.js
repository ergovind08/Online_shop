import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div class="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS Mobile Phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="appstore" />
      </div>

      <div class="middleFooter">
        <h1>ECOMMERCE.</h1>
        <p>High Quality is our First Priority</p>

        <p>Copyrights 2024 &copy; Ecommerce</p>
      </div>

      <div class="rightFooter">
        <h4>Follow US</h4>
        <a href="https://www.instagram.com/" target="_blank">
          Instagram
        </a>
        <a href="https://www.youtube.com/" target="_blank">
          YouTube
        </a>
        <a href="https://www.linkedin.com/" target="_blank">
          LinkdIn
        </a>
        <a href="https://www.twitter.com/" target="_blank">
          Twitter
        </a>
      </div>
    </footer>
  );
};

export default Footer;
