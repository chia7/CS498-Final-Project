import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { SectionSplitProps } from "../../utils/SectionProps";
import SectionHeader from "./partials/SectionHeader";
import Image from "../elements/Image";
import axios from "axios";
import ButtonGroup from "../elements/ButtonGroup";
import Button from "../elements/Button";

const propTypes = {
  ...SectionSplitProps.types,
};

const defaultProps = {
  ...SectionSplitProps.defaults,
};

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {
  const outerClasses = classNames(
    // "features-split section",
    "hero section center-content",
    topOuterDivider && "has-top-divider",
    bottomOuterDivider && "has-bottom-divider",
    hasBgColor && "has-bg-color",
    invertColor && "invert-color",
    className
  );

  const innerClasses = classNames(
    "features-split-inner section-inner",
    topDivider && "has-top-divider",
    bottomDivider && "has-bottom-divider"
  );

  const splitClasses = classNames(
    "split-wrap",
    invertMobile && "invert-mobile",
    invertDesktop && "invert-desktop",
    alignTop && "align-top"
  );

  const sectionHeader = {
    title: "Question 2",
    paragraph:
      "From which country have the tweets been most actively posted (most number of tweets)?",
  };

  const [question2, setQ2] = useState([]);
  const [question3, setQ3] = useState([]);
  const [question4, setQ4] = useState([]);
  const [question5, setQ5] = useState([]);

  const fetchData2 = () => {
    fetch("/q2").then((respnse) =>
      respnse.json().then((data) => {
        setQ2(data.result);
        console.log(data);
      })
    );
  };

  const fetchData3 = () => {
    fetch("/q3").then((respnse) =>
      respnse.json().then((data) => {
        setQ3(data.result);
        console.log(data);
      })
    );
  };

  const fetchData4 = () => {
    fetch("/q4").then((respnse) =>
      respnse.json().then((data) => {
        setQ4(data.result);
        console.log(data);
      })
    );
  };

  const fetchData5 = () => {
    fetch("/q5").then((respnse) =>
      respnse.json().then((data) => {
        setQ5(data.result);
        console.log(data);
      })
    );
  };

  const handelButtonClick2 = () => {
    fetchData2();
  };

  const handelButtonClick3 = () => {
    fetchData3();
  };
  const handelButtonClick4 = () => {
    fetchData4();
  };
  const handelButtonClick5 = () => {
    fetchData5();
  };

  // useEffect(() => {
  //   fetchData2();
  //   fetchData3();
  // }, []);

  return (
    <section {...props} className={outerClasses}>
      {/* Question 2!!!!!!!!!!!!!!!!! */}
      <div className="container-sm">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className="hero-content">
            <div className="container-xs">
              <h5
                className="m-0 mb-32 reveal-from-bottom"
                data-reveal-delay="400"
                color="white"
              >
                The answer of the questions is: {question2}{" "}
              </h5>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <ButtonGroup>
                  <Button
                    onClick={handelButtonClick2}
                    tag="a"
                    color="primary"
                    wideMobile
                  >
                    Reveal Q2!
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>

          {/* Question 3!!!!!!!!!!!!!!!!! */}
          <div className={splitClasses}>
            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Abdu is so handsome
                </div>
                <h3 className="mt-0 mb-12">Question 3</h3>
                <p className="m-0">Which user has posted the most tweets?</p>
                <h5>The answer of the question is: {question3} </h5>
                <ButtonGroup>
                  <Button
                    onClick={handelButtonClick3}
                    tag="a"
                    color="primary"
                    wideMobile
                  >
                    Reveal Q3!
                  </Button>
                </ButtonGroup>
              </div>
              <div
                className={classNames(
                  "split-item-image center-content-mobile reveal-from-bottom",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src={require("./../../assets/images/pic1.png")}
                  alt="Features split 01"
                  width={528}
                  height={396}
                />
              </div>
            </div>

            {/* Question 4!!!!!!!!!!!!!!!!! */}
            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-right"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Abdu is so handsome
                </div>
                <h3 className="mt-0 mb-12">Question 4</h3>
                <p className="m-0">
                  (Trending) How many tweets are associated with each hashtag?
                  (For a tweet with multiple hashtags, count it for each.) Give
                  the hashtag and count for the top 100 counts.
                </p>
                <h5>The answer of the question is:{question4} </h5>
                <ButtonGroup>
                  <Button
                    onClick={handelButtonClick4}
                    tag="a"
                    color="primary"
                    wideMobile
                  >
                    Reveal Q4!
                  </Button>
                </ButtonGroup>
              </div>
              <div
                className={classNames(
                  "split-item-image center-content-mobile reveal-from-bottom",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src={require("./../../assets/images/pic2.jpg")}
                  alt="Features split 02"
                  width={528}
                  height={396}
                />
              </div>
            </div>

            {/* Question 5!!!!!!!!!!!!!!!!! */}
            <div className="split-item">
              <div
                className="split-item-content center-content-mobile reveal-from-left"
                data-reveal-container=".split-item"
              >
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Abdu is so handsome
                </div>
                <h3 className="mt-0 mb-12">Question 5</h3>
                <p className="m-0">
                  Are there any three users A, B, C such that: User A has
                  replied to a tweet of User B and B has replied to a tweet of
                  User A, and similarly for A & C and B&C? Display each trio
                  with the names and screen names of the three users.
                </p>
                <h5>The answer of the question is:{question5} </h5>
                <ButtonGroup>
                  <Button
                    onClick={handelButtonClick5}
                    tag="a"
                    color="primary"
                    wideMobile
                  >
                    Reveal Q5!
                  </Button>
                </ButtonGroup>
              </div>
              <div
                className={classNames(
                  "split-item-image center-content-mobile reveal-from-bottom",
                  imageFill && "split-item-image-fill"
                )}
                data-reveal-container=".split-item"
              >
                <Image
                  src={require("./../../assets/images/pic3.jpg")}
                  alt="Features split 03"
                  width={528}
                  height={396}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;
