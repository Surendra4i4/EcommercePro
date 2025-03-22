import { Link } from "wouter";

interface CategoryCardProps {
  name: string;
  image: string;
  slug: string;
}

export default function CategoryCard({ name, image, slug }: CategoryCardProps) {
  return (
    <Link href={`/?category=${slug}`}>
      <a className="group">
        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
          <img 
            src={image}
            alt={`${name} category`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
        </div>
      </a>
    </Link>
  );
}
