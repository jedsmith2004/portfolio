import { FC, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface TaglineCyclerProps {
  taglines: string[];
}

const TaglineCycler: FC<TaglineCyclerProps> = ({ taglines }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!taglines.length) return;
    const container = containerRef.current;
    let currentIndex = 0;

    const animateTagline = () => {
      // Get current tagline text
      const tagline = taglines[currentIndex];
      // Clear previous content
      if (container) {
        container.innerHTML = "";
      }
      
      // Create spans for each letter
      const letters = tagline.split("").map((letter) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.className = "mr-2 inline-block";
        span.style.opacity = "0";
        return span;
      });
      letters.forEach((span) => container?.appendChild(span));

      // Create a timeline for typing and erasing.
      const tl = gsap.timeline({
        onComplete: () => {
          // Erase after a delay
          gsap.to(letters, {
            duration: 0.2,
            opacity: 0,
            stagger: 0.05,
            delay: 5,
            onComplete: () => {
              currentIndex = (currentIndex + 1) % taglines.length;
              animateTagline();
            },
          });
        },
      });
      // Animate letters to fade in (simulate typing)
      tl.to(letters, { duration: 0.2, opacity: 1, stagger: 0.05 });
    };

    animateTagline();

    return () => gsap.killTweensOf(container);
  }, [taglines]);

  return <span ref={containerRef} className="tagline-list inline-block" />;
};

export default TaglineCycler;
