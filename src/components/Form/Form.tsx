import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";

/**
 * Interface for form field values
 */
export interface IFormValues {
  name: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
}

/**
 * A form component that handles contact information submission with validation
 * @returns Rendered form component
 */
const ContactForm = () => {
  const [forms, setForms] = useState<IFormValues>({
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [validator] = useState(
    new SimpleReactValidator({
      className: "errorMessage",
    })
  );

  useEffect(() => {
    // Load reCAPTCHA v3 script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /**
   * Handles changes in form input fields
   * @param event - Change event from form input
   * @returns void
   */
  const changeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setForms({ ...forms, [event.target.name]: event.target.value });
    validator.showMessageFor(event.target.name);
  };

  /**
   * Handles form submission
   * @param event - Form submission event
   * @returns void
   */
  const submitHandler = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!validator.allValid()) {
      validator.showMessages();
      return;
    }

    setLoading(true);
    try {
      // Execute reCAPTCHA v3
      let token = "";
      if (window.grecaptcha) {
        if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
          throw new Error("Missing reCAPTCHA site key");
        }
        token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          {
            action: "submit",
          }
        );
      }

      // Add token to form data
      const formData = new FormData(event.currentTarget);
      formData.append("g-recaptcha-response", token);

      // Submit the form
      await fetch("/", {
        method: "POST",
        body: formData,
      });

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I will get back to you soon.",
      });

      setForms({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      method="POST"
      name="contact"
      data-netlify="true"
      className="contact-validation-active"
      onSubmit={submitHandler}
      noValidate
      aria-label="Contact form"
    >
      <input type="hidden" name="form-name" value="contact" />

      {/* Remove the visible reCAPTCHA widget - v3 is invisible */}
      <div className="row align-items-center">
        <div className="col-md-6 col-md-6 col-12">
          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              id="name"
              value={forms.name}
              type="text"
              name="name"
              onBlur={changeHandler}
              onChange={changeHandler}
              className="form-control"
              placeholder="Who are you?"
              required
              aria-required="true"
              aria-invalid={!validator.fieldValid("name")}
            />
            {validator.message("name", forms.name, "required|alpha_space")}
          </div>
        </div>
        <div className="col-md-6 col-md-6 col-12">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              value={forms.email}
              type="email"
              name="email"
              onBlur={changeHandler}
              onChange={changeHandler}
              className="form-control"
              placeholder="How can I get in touch with you?"
              required
              aria-required="true"
              aria-invalid={!validator.fieldValid("email")}
            />
            {validator.message("email", forms.email, "required|email")}
          </div>
        </div>
        <div className="col-md-12">
          <div className="fullwidth form-group">
            <label htmlFor="message">Message*</label>
            <textarea
              id="message"
              onBlur={changeHandler}
              onChange={changeHandler}
              value={forms.message}
              name="message"
              className="form-control"
              placeholder="How can I help?"
              required
              aria-required="true"
              aria-invalid={!validator.fieldValid("message")}
            />
            {validator.message("message", forms.message, "required")}
          </div>
        </div>
        <div className="col-md-5 order-md-1 order-2 col-12">
          <div className="submit-area">
            <button
              type="submit"
              className="theme-btn"
              disabled={loading}
              aria-label={loading ? "Sending..." : "Submit form"}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {submitStatus.type && (
        <div
          className={`alert ${
            submitStatus.type === "success" ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {submitStatus.message}
        </div>
      )}
    </form>
  );
};

export default ContactForm;
