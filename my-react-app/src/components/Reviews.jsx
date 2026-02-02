import { useState, useEffect } from "react";
import React from "react";
const reviewList = [
  { text: "Absolutely loved the facial treatment!", author: "Priya Sharma" },
  { text: "Top-class service. Highly Recommended!", author: "Anjali Mehta" },
  { text: "The staff is friendly and professional.", author: "Riya Kapoor" },
  { text: "Their hair spa is super relaxing!", author: "Sneha Patil" },
  { text: "One of the best salons in town.", author: "Megha Nair" }
];

function Reviews() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % reviewList.length);
  const prev = () => setIndex((i) => (i - 1 + reviewList.length) % reviewList.length);

  useEffect(() => {
    const auto = setInterval(next, 5000);
    return () => clearInterval(auto);
  }, []);

  return (
    <div className="reviews">
      <section className="section-divider">
        <div className="divider-line"></div>
        <h2 className="divider-title">Your Review Matters!!!</h2>
        <div className="divider-line"></div>
      </section>

      <section className="review-section">
        <button className="arrow left" onClick={prev}>❮</button>

        <div className="review-box">
          <p className="review-text">"{reviewList[index].text}"</p>
          <p className="review-author">– {reviewList[index].author}</p>
        </div>

        <button className="arrow right" onClick={next}>❯</button>
      </section>
    </div>
  );
}

export default Reviews;
