import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ShopEase</h3>
            <p className="text-gray-400 mb-4">Your one-stop destination for all your shopping needs.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=electronics">
                  <a className="text-gray-400 hover:text-white">Electronics</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=clothing">
                  <a className="text-gray-400 hover:text-white">Clothing</a>
                </Link>
              </li>
              <li>
                <Link href="/?category=home">
                  <a className="text-gray-400 hover:text-white">Home & Decor</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">Returns & Refunds</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth">
                  <a className="text-gray-400 hover:text-white">Sign In</a>
                </Link>
              </li>
              <li>
                <Link href="/cart">
                  <a className="text-gray-400 hover:text-white">View Cart</a>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <a className="text-gray-400 hover:text-white">My Orders</a>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <a className="text-gray-400 hover:text-white">Track My Order</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2023 ShopEase. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-8">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
