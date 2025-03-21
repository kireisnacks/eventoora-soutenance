'use client';

const mainCategories = [
  {
    id: 'reunion',
    title: 'Réunions',
    examples: 'Séminaires, Formations, Conférences, etc...',
    imageUrl: '/meeting.jpg'
  },
  {
    id: 'evenement',
    title: 'Évènements',
    examples: 'Anniversaires, Mariages, Soirées, etc...',
    imageUrl: '/event.jpg'
  },
  {
    id: 'production',
    title: 'Productions',
    examples: 'Photos, Vidéos, Enregistrements, etc...',
    imageUrl: '/prod.jpg'
  }
];

interface ImageSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange
}) => {
  const toggleCategory = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onChange(value.filter(id => id !== categoryId));
    } else {
      onChange([...value, categoryId]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
      {mainCategories.map((category) => (
        <div
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          className={`
            relative
            cursor-pointer
            overflow-hidden
            rounded-xl
            shadow-lg
            aspect-square
            group
            transition-all
            duration-300
            ${value.includes(category.id) ? 'scale-[1.02]' : ''}
          `}
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />
          <div
            className={`
              absolute
              inset-0
              bg-cover
              bg-center
              transition-all
              duration-500
              group-hover:scale-110
              ${value.includes(category.id) 
                ? 'grayscale-0 blur-0' 
                : 'grayscale brightness-75 blur-sm'
              }
            `}
            style={{ backgroundImage: `url(${category.imageUrl})` }}
          />
          <div className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            text-white
            text-center
            p-4
            transform
            transition-all
            duration-300
            group-hover:scale-105
          ">
            <h3 className="text-2xl font-bold mb-2">
              {category.title}
            </h3>
            <p className="text-sm opacity-90">
              {category.examples}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageSelector;
