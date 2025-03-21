'use client';

import localFont from 'next/font/local';

const angelaheartFont = localFont({ src: "/../../../public/fonts/angelaheart.otf" });
const chicFont = localFont({ src: "/../../../public/fonts/chic-avenue.otf" });

interface Partnership {
  name: string;
  logo: string;
  className: string;
}

interface PartnershipProps {
  title?: string;
  subtitle?: string;
  logos?: Partnership[];
}

const Partnerships = ({
  title = "Nos Partenaires Commerciaux",
  subtitle = "Ceux qui nous accompagnent dans cette aventure. ",
  logos = [
    {
      name: "Vercel",
      logo: "https://shadcnblocks.com/images/block/logos/vercel-wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      name: "Astro",
      logo: "https://shadcnblocks.com/images/block/logos/tailwind-wordmark.svg",
      className: "h-5 w-auto",
    },
    {
      name: "Supabase",
      logo: "https://shadcnblocks.com/images/block/logos/supabase-wordmark.svg",
      className: "h-6 w-auto",
    },
    {
      name: "Figma",
      logo: "https://shadcnblocks.com/images/block/logos/figma-wordmark.svg",
      className: "h-5 w-auto",
    },
    {
      name: "Astro",
      logo: "https://shadcnblocks.com/images/block/logos/astro-wordmark.svg",
      className: "h-6 w-auto",
    },
  ],
}) => {
  return (
    <section className="py-6 pb-12 bg-eventoora flex items-center justify-center"> {/* py-8 pb-16 */}
      <div className="container text-center">
        <div className="flex flex-col items-center">
          <h2
            className={angelaheartFont.className}
            style={{
              fontSize: '4.5rem',
              color: '#FEE2E2',
            }}
          >
            {title}
          </h2>
          {/* <p className={`${chicFont.className} -mt-2`}
             style = {{
              fontSize: '1.5rem',
              color: 'white',
             }}
          >
            "{subtitle}"
          </p> */}
          <div className="mt-3 flex flex-wrap justify-center gap-x-8 gap-y-6 lg:gap-12">
            {logos.map((logo, index) => (
              <img
                key={index}
                src={logo.logo}
                alt={`${logo.name} logo`}
                width={109}
                height={48}
                className={`${logo.className} mx-auto`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Partnerships };
