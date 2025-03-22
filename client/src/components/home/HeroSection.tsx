import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900">
      <div 
        className="h-96 bg-cover bg-center flex items-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Shop the Latest Trends</h1>
          <p className="text-xl text-white mb-8">Discover quality products at amazing prices</p>
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-md shadow-md transition">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
