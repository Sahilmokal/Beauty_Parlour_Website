import { useEffect, useState } from "react";
import React from "react";
function Slider() {
  const slides = [
    {
      img: "/images/bg_landing.jpg",
      caption: `"Beauty begins the moment you decide to be yourself."`
    },
    {
      img: "/images/bg_landing02.png",
      caption: `"Let your beauty shine from within."`
    },
    {
      img: "/images/bg_landing03.png",
      caption: `"At Sanskruti, we celebrate the art of beauty."`
    }
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const auto = setInterval(next, 6000);
    return () => clearInterval(auto);
  }, []);

  return (
    <section className="landing-section">
  <div className="slider">
    {slides.map((slide, i) => (
      <div key={i} className={`slide fade ${i === index ? "active" : ""}`}>
        <img src={slide.img} alt="" />
        <div className="caption">{slide.caption}</div>
      </div>
    ))}

    <a className="prev" onClick={prev}>❮</a>
    <a className="next" onClick={next}>❯</a>
  </div>
</section>

  );
}

export default Slider;
