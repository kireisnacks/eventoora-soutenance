import Image from "next/image";

interface ImageWithTextOverlayProps {
    src: string;
    alt: string;
    firstRow: string;
    SecondRow: string;
    width?: number;
    height?: number;
}

const ImageWithTextOverlay: React.FC<ImageWithTextOverlayProps> = ({
    src,
    alt,
    firstRow,
    SecondRow,
    width = 500,
    height = 375,
}) => {
    return (
        <div className="relative">
            <div className="absolute bottom-0 left-0 right-0 flex flex-col text-black p-4">
                <span className="text-4xl font-bold">{firstRow}</span>
                <span className="text-4xl">{SecondRow}</span>
            </div>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-[375px] object-cover"
            />
        </div>
    );
};

export default ImageWithTextOverlay;
