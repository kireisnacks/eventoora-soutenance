'use client';

import localFont from "next/font/local";

const chicFont = localFont({ src: "/../../public/fonts/chic-avenue.otf" });

interface SectionHeadingProps {
  title: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => (
  <div className="relative flex items-center py-8">
    <div className="flex-grow border-t-2 border-neutral-300"></div>
    <h2 className={` ${chicFont.className} mx-4 text-xl font-bold text-neutral-700 whitespace-nowrap`}>
      {title}
    </h2>
    <div className="flex-grow border-t-2 border-neutral-300"></div>
  </div>
);