import React from "react";
import Form from "@/components/Form";

/**
 * Contact component
 * @component
 * @returns Contact component
 */
const Contact = () => {
  return (
    <section className="tp-contact-form-area section-padding">
      <div className="container">
        <div className="tp-contact-form-wrap">
          <div className="tp-section-title">
            <h2>Get in touch with me</h2>
            <p>Your privacy is important to me, your data will not be shared</p>
          </div>
          <Form />
        </div>
      </div>
    </section>
  );
};

export default Contact;
