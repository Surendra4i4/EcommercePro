import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to your backend
    toast({
      title: "Thank you for subscribing!",
      description: "You'll start receiving our newsletter soon.",
    });
    setEmail("");
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-gray-500 mb-6">
            Stay updated on new products, exclusive offers, and more.
          </p>
          <form 
            className="flex flex-col sm:flex-row sm:justify-center gap-2"
            onSubmit={handleSubmit}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 max-w-sm"
              placeholder="Enter your email"
              required
            />
            <Button type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
