import { Truck, RefreshCw, Lock } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="text-primary w-8 h-8" />,
      title: "Fast Delivery",
      description: "Get your products delivered to your doorstep within 2-3 business days.",
    },
    {
      icon: <RefreshCw className="text-primary w-8 h-8" />,
      title: "Easy Returns",
      description: "Not satisfied with your purchase? Return it within 30 days for a full refund.",
    },
    {
      icon: <Lock className="text-primary w-8 h-8" />,
      title: "Secure Payments",
      description: "Your payment information is always protected with our secure payment system.",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Why Shop With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-primary-50 p-3 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
