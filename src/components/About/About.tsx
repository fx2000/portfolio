import Image from "next/image";
import React from "react";
// import { IStatItem } from "@/types/types";

const aImg = "/images/workstation.jpg";

/**
 * Statistics data
 */
/* const stats: IStatItem[] = [
  { count: "500+", label: "Projects Completed" },
  { count: "52+", label: "Awards Won" },
  { count: "2M+", label: "Happy Clients" },
]; */

/**
 * About section component
 * @component
 * @description Displays professional experience, services offered, and key statistics
 * @returns The rendered About section
 */
const About = () => {
  return (
    <section
      id="about"
      className="tf-about-section section-padding"
      aria-labelledby="about-heading"
    >
      <div className="container">
        <div className="tf-about-wrap">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-12">
              <figure className="tf-about-img">
                {aImg && (
                  <Image
                    src={aImg}
                    alt="Daniel Duque working at his desk"
                    width={600}
                    height={700}
                    quality={90}
                    priority
                  />
                )}
                <div className="tf-about-img-text">
                  <div className="tf-about-icon" role="text">
                    <h3 aria-label="15+ years of experience">15+</h3>
                    <span>Years Experience</span>
                  </div>
                </div>
              </figure>
            </div>

            <div className="col-lg-6 col-md-12 col-12">
              <div className="tf-about-text">
                <header>
                  <small aria-hidden="true">About Me</small>
                  <h2 id="about-heading">
                    I&apos;m Daniel and I&apos;m a software engineer
                  </h2>
                  <p className="lead">
                    I have over 15 years of experience in the software and web
                    development industry
                  </p>
                </header>

                <p>
                  I&apos;ve held roles like Founder, Engineering Manager,
                  Technical Lead, and Full-Stack Senior Engineer. I excel in
                  Typescript and JavaScript technologies and have ample
                  experience in front-end solutions like React, Next and React
                  Native; in back-end solutions like Node, MongoDB, MySQL, and
                  APIs using REST and GraphQL; and in cloud platforms like AWS
                  (Lambda, DynamoDB, Amplify). <br />I care greatly for design,
                  accessibility and responsiveness, have extensive independent
                  freelancing and contracting experience with multiple projects
                  delivered successfully, and hold certifications as a
                  Professional Scrum Master and Scrum Developer.
                </p>

                {/*                 <div className="tf-funfact" role="list">
                  {stats.map(({ count, label }) => (
                    <div
                      key={label}
                      className="tf-funfact-item"
                      role="listitem"
                    >
                      <dl>
                        <dt>
                          <span aria-label={`${count} ${label}`}>{count}</span>
                        </dt>
                        <dd>{label}</dd>
                      </dl>
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
