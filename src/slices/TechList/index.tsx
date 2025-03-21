"use client"

import React, { FC, useEffect, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Heading from "@/components/Heading";

gsap.registerPlugin(ScrollTrigger)

/**
 * Props for `TechList`.
 */
export type TechListProps = SliceComponentProps<Content.TechListSlice>;

/**
 * Component for "TechList" Slices.
 */
const TechList: FC<TechListProps> = ({ slice }) => {
  const component = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: component.current,
          markers: false,
          start: "top bottom",
          end: "bottom top",
          scrub: 4,
        }
      });

      tl.fromTo(
        ".tech-row",
        {
          x: (index) => {
            return index % 2 === 0 
            ? gsap.utils.random(600, 400) 
            : gsap.utils.random(-600, -400);
          }
        }, 
        {
          x: (index) => {
            return index % 2 === 0 
            ? gsap.utils.random(-600, -400) 
            : gsap.utils.random(600, 400);
          },
          ease: "power1.inOut",
        }
      );

    }, component)
    return () => ctx.revert() // Cleanup
  })

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden"
      ref={component}
    >
      <article className="px-4 py-10 md:px-6 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <Heading size="xl" className="mb-8" as="h2">
          {slice.primary.heading}
        </Heading>
      </div>
      </article>

      {slice.primary.tech?.map(({ tech_color, tech_name }, index) => (
        <div
          key={index}
          className="tech-row mb-8 flex items-center justify-center gap-4 text-slate-700"
          aria-label={tech_name || undefined}
        >
          {Array.from({ length: 15 }, (_, index) => (
            <React.Fragment key={index}>
              <span className="tech-item text-8xl font-extrabold uppercase tracking-tighter"
                style={{
                  color: index === 7 && tech_color ? tech_color : "inherit",
                }}>
                {tech_name}
              </span>
              <span className="text-3xl">
                <MdCircle />
              </span>
            </React.Fragment>
          ))}
        </div>
      ))}
    </section>
  );
};

export default TechList;
