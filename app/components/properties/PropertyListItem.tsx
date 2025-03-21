import Image from "next/image";

const PropertyListItem = () => {
    return (
        <div className ="cursor-pointer">
            <div className ="relative overflow-hidden aspect-square rounded-xl">
                <Image
                    fill
                    src='/placeholder-property.jpg'
                    sizes="(max-width: 768px) 768px, (max-width: 1200px) 768px, 768px"
                    className ="hover:scale-110 object-cover transition h-full w-full"
                    alt ="Placeholder Property Image"
                />
            </div>

            <div className="mt-2">
                <p className = "text-lg font-bold">Property name</p>
            </div>

            <div className="">
                <p className = "text-sm text-muted-foreground">Property description</p>
            </div>

            <div className="mt-1">
                <p className = "text-base font-bold">20000AR/h</p>
            </div>
        </div>
    )
}

export default PropertyListItem;