import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCartDrawer } from "./shopping-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  User, 
  LogOut, 
  ShoppingBag, 
  LayoutDashboard,
  ChevronDown
} from "lucide-react";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to home with search query
    setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Promo bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-center text-sm">
          <p>Free shipping on orders over $100 | <span className="font-semibold">30% OFF</span> seasonal items</p>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <form className="relative" onSubmit={handleSearch}>
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <div className="space-y-2 pt-4">
                  <Link 
                    href="/" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block px-2 py-2 hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/?category=electronics" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block px-2 py-2 hover:text-primary"
                  >
                    Electronics
                  </Link>
                  <Link 
                    href="/?category=furniture" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block px-2 py-2 hover:text-primary"
                  >
                    Furniture
                  </Link>
                  <Link 
                    href="/?category=home" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block px-2 py-2 hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/?category=kitchen" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="block px-2 py-2 hover:text-primary"
                  >
                    Kitchen
                  </Link>
                </div>

                {user ? (
                  <div className="pt-4 border-t space-y-2">
                    <div className="px-2 py-2">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    
                    {user.isAdmin && (
                      <Link 
                        href="/admin" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="flex items-center px-2 py-2 hover:text-primary"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t space-y-2">
                    <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">Login</Button>
                    </Link>
                    <Link href="/auth?register=true" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-primary font-bold text-2xl tracking-tight">
              Shop<span className="text-green-500">Ease</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-gray-700 hover:text-primary transition-colors">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/?category=electronics" className="w-full">Electronics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/?category=furniture" className="w-full">Furniture</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/?category=home" className="w-full">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/?category=kitchen" className="w-full">Kitchen</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <form 
              className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64"
              onSubmit={handleSearch}
            >
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input 
                type="search"
                placeholder="Search products..." 
                className="bg-transparent outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex w-full cursor-default">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}
            
            {/* Cart */}
            <ShoppingCartDrawer>
              <Button variant="ghost" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </ShoppingCartDrawer>
          </div>
        </div>
      </div>
    </header>
  );
}
