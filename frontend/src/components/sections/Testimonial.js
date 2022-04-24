import React, { useState } from "react";
import classNames from "classnames";
import { SectionTilesProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import ButtonGroup from "../elements/ButtonGroup";
import Button from "../elements/Button";

const propTypes = {
  ...SectionTilesProps.types,
};

const defaultProps = {
  ...SectionTilesProps.defaults,
};

const Testimonial = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {
  const outerClasses = classNames(
    // "testimonial section",
    "hero section center-content",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "testimonial-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const tilesClasses = classNames("tiles-wrap", pushLeft && "push-left");

  const sectionHeader = {
    title: "Question 6",
    paragraph:
      "(Nature of engagement) For each verified user, what is the percentage of different types of tweets (simple tweet, reply, retweet, quoted tweet) compared to his or her overall number of tweets?",
  };

  const [question6, setQ6] = useState([]);

  const fetchData6 = () => {
    fetch("/q6").then((respnse) =>
      respnse.json().then((data) => {
        setQ6(data.result);
        console.log(data);
      })
    );
  };

  const handelButtonClick6 = () => {
    fetchData6();
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <section {...props} className={outerClasses}>
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <h5>The answer of the question is: {question6}</h5>
          <ButtonGroup>
            <Button
              onClick={handelButtonClick6}
              tag="a"
              color="primary"
              wideMobile
            >
              Reveal Q6!
            </Button>
          </ButtonGroup>
          <div className={tilesClasses}>
            {/* <div
              className="tiles-item reveal-from-right"
              data-reveal-delay="200"
            >
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum cillum dolore eu fugiat.
                  </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">
                    Roman Level
                  </span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">AppName</a>
                  </span>
                </div>
              </div>
            </div> */}

            {/* <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum cillum dolore eu fugiat.
                  </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">
                    Diana Rynzhuk
                  </span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">AppName</a>
                  </span>
                </div>
              </div>
            </div> */}

            {/* <div
              className="tiles-item reveal-from-left"
              data-reveal-delay="200"
            >
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum cillum dolore eu fugiat.
                  </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">
                    Ben Stafford
                  </span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">AppName</a>
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;
