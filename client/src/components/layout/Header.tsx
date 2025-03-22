import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Search, Menu, User, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ShoppingCart from "@/components/cart/ShoppingCart";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <a className="text-primary font-bold text-xl">ShopEase</a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <a className={`text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium ${location === "/" ? "text-primary" : ""}`}>
                Home
              </a>
            </Link>
            <Link href="/?category=electronics">
              <a className={`text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium ${location === "/?category=electronics" ? "text-primary" : ""}`}>
                Electronics
              </a>
            </Link>
            <Link href="/?category=clothing">
              <a className={`text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium ${location === "/?category=clothing" ? "text-primary" : ""}`}>
                Clothing
              </a>
            </Link>
            <Link href="/?category=home">
              <a className={`text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium ${location === "/?category=home" ? "text-primary" : ""}`}>
                Home
              </a>
            </Link>
            {user?.role === "admin" && (
              <Link href="/admin">
                <a className={`text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium ${location.startsWith("/admin") ? "text-primary" : ""}`}>
                  Admin
                </a>
              </Link>
            )}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-600 hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Auth buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:text-primary"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    Hi, {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-primary"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart button with Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-primary relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <ShoppingCart />
              </SheetContent>
            </Sheet>

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-600 hover:text-primary"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col space-y-4 mt-4">
                  <SheetClose asChild>
                    <Link href="/">
                      <a className="block p-2 font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                        Home
                      </a>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/?category=electronics">
                      <a className="block p-2 font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                        Electronics
                      </a>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/?category=clothing">
                      <a className="block p-2 font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                        Clothing
                      </a>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/?category=home">
                      <a className="block p-2 font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                        Home
                      </a>
                    </Link>
                  </SheetClose>
                  {user?.role === "admin" && (
                    <SheetClose asChild>
                      <Link href="/admin">
                        <a className="block p-2 font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                          Admin
                        </a>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-24 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Search Products</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
