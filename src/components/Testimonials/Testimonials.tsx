import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { sliderConfig } from "@/config/sliderConfig";
import { useGetTestimonials } from "@/hooks";

/**
 * Testimonials component
 * @returns Testimonials component
 */
const Testimonials = () => {
  const { data: testimonials = [] } = useGetTestimonials();

  return (
    <section
      className="tp-testimonial-section section-padding"
      aria-labelledby="testimonials-title"
    >
      <div className="container">
        <div className="tp-section-title">
          <span>References</span>
          <h2 id="testimonials-title">What they say about me</h2>
        </div>

        <div
          className="tp-testimonial-wrap"
          role="region"
          aria-label="Testimonials carousel"
        >
          <Slider {...sliderConfig}>
            {testimonials.map((testimonial) => (
              <div
                className="tp-testimonial-item"
                key={testimonial.id}
                role="article"
              >
                <div className="tp-testimonial-text">
                  <blockquote>
                    <p>{testimonial.description}</p>
                    <footer>
                      <cite>{testimonial.name}</cite>
                      <br />
                      <cite>{testimonial.position}</cite>
                      <br />
                      <cite>{testimonial.company}</cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
