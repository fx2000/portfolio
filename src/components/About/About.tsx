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
                    I&apos;m Daniel and I&apos;m a Technical Lead and Senior
                    Full-Stack Engineer
                  </h2>
                  <p className="lead">
                    I have over 15 years of experience in the software and web
                    development industry
                  </p>
                </header>

                <p>
                  Driving architecture, delivery, and evolution
                  of scalable platforms and internal tooling across startups, AI
                  labs, and enterprise environments. Focused on TypeScript,
                  Next.js, Node.js, Python, FastAPI, and AWS, with strong
                  experience building AI-driven products using
                  retrieval-augmented generation and LLM integrations. Known for
                  shaping architectural direction, improving engineering
                  velocity, and shipping production-ready systems that connect
                  user-facing applications with scalable backend platforms,
                  while mentoring engineers and aligning technical decisions
                  with product and business goals.
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
