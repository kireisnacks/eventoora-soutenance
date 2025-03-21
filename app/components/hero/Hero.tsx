"use client";

import React, { useEffect } from 'react';
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import  SearchFilters from './SearchFilters';
import useEmblaCarousel from 'embla-carousel-react';
import './embla.css';

import localFont from 'next/font/local';

const chicFont = localFont({ src: "/../../../public/fonts/chic-avenue.otf" });

interface HeroProps {
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  images: {
    src: string;
    alt: string;
  }[];
}

const Hero = ({
  heading = "Trouver un foyer à votre vision.",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Link 1",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "Link 2",
      url: "https://www.shadcnblocks.com",
    },
  },
  images = [
    {
      src: "/Carousel/C1.jpg",
      alt: "Anniversaire Carousel Hero Carousel Image",
    },
    {
      src: "/Carousel/C2.jpg",
      alt: "Conference Meeting Hero Carousel Image",
    },
    {
      src: "/Carousel/C3.jpg",
      alt: "Concert Hero Carousel Image",
    },
    {
      src: "/Carousel/C4.jpg",
      alt: "Photoshooting Hero Carousel Image",
    },
    {
      src: "/Carousel/C5.jpg",
      alt: "Marriage Hero Carousel Image",
    },
  ],
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [emblaApi]);

  return (
    <section className="w-full flex flex-col items-center justify-center min-h-screen px-4 -mt-16 bg-red-100 relative">
    <div 
        className="absolute inset-0 z-0 opacity-15" 
        style={{ 
            backgroundImage: 'url("/TopoPattern.png")',
            backgroundRepeat: 'repeat',
            backgroundSize: '400px 400px'
        }} 
    />
      <div className="container text-center relative z-9">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center lg:items-start lg:text-left">
            <h1 className={ `${chicFont.className} my-6 text-pretty text-4xl lg:text-6xl`}>
              {heading}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl ">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="embla w-full">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                {images.map((image, index) => (
                  <div className="embla__slide" key={index}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="max-h-96 w-full rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto pt-16">        
            <SearchFilters />
        </div>
      </div>
    </section>
  );
};

export { Hero };
