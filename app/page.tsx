import Image from "next/image";
import { Hero } from "./components/hero/Hero";
import { Partnerships } from "./components/partnership/Partnership";
import Categories from "./components/categories/Categories";
import PropertyList from "./components/properties/PropertyList";
import ImageWithTextOverlay from "./components/ImageWithTextOverlay"; // Adjust the import path as necessary

export default function Home() {
  return (
    <div className="">
      <main className="">
        <Hero />
        <Partnerships />

        {/* Flex container for layout */}
        <div className="flex flex-col md:flex-row">
          {/* Image with text overlay on top for small screens */}
          <div className="md:w-1/3 p-4 order-first md:order-none">
            <ImageWithTextOverlay
                src="/3rdsection.jpg" // Replace with your image path
                alt="Descriptive Alt Text"
                firstRow="Jetez un"
                SecondRow="Coup d'oeil."
            />
          </div>

          {/* Left side: Categories and Property List */}
          <div className="md:w-2/3 pt-4">
            <Categories />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <PropertyList />
            </div>
          </div>
        </div>

      </main>
      <footer className="">
      </footer>
    </div>
  );
}
