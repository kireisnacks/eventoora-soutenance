import Image from 'next/image';

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <div className="relative h-10 w-10 rounded-full overflow-hidden">
      <Image
        fill
        className="object-cover"
        alt="Avatar"
        src={src || '/placeholder-profile.png'}
      />
    </div>
  );
};

export default Avatar;