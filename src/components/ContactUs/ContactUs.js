import React from "react";
import "./ContactUs.css";
import VerticalNavBar from "../VerticalNavBar/VerticalNavBar";
import { Container } from "react-bootstrap";
import AppNavbar from "../Navbar/Navbar";

const ContactUs = () => {
  return (
    <>
      <AppNavbar />
      <VerticalNavBar />
      <Container>
        <div className="contact-us-container">
          <h1>Contact Us</h1>
          <p>
            Please feel free to reach out to us through the following means!
          </p>
          <ul>
            <li>Email: contact@blogit.com</li>
            <li>Phone: +1 (782) 882 890</li>
            <li>Address: 123 South St, Halifax, NS, Canada</li>
          </ul>
        </div>
      </Container>
    </>
  );
};

export default ContactUs;
