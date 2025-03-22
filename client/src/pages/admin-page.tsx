import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order, Product, insertProductSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PackageOpen, 
  Users, 
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  MoreHorizontal,
  Eye,
  Search,
  ArrowUp,
  ArrowDown,
  Check,
  LineChart,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);

  // Fetch products
  const { 
    data: products = [], 
    isLoading: isLoadingProducts
  } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch orders with items
  const { 
    data: orders = [], 
    isLoading: isLoadingOrders 
  } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const res = await apiRequest("POST", "/api/products", productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
      });
      setIsAddProductOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Deleted",
        description: "Product has been removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Product form
  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: 0,
      rating: "0",
    },
  });

  const onSubmit = (data: any) => {
    // Convert number strings to numbers
    const formattedData = {
      ...data,
      price: data.price.toString(),
      stock: parseInt(data.stock),
      rating: data.rating.toString(),
    };
    addProductMutation.mutate(formattedData);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    product => product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    order => order.id.toString().includes(orderSearchQuery) || 
            order.status.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  // Calculate dashboard stats
  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => product.stock < 5).length;

  // Get order status statistics
  const orderStats = {
    processing: orders.filter(order => order.status === "Processing").length,
    shipped: orders.filter(order => order.status === "Shipped").length,
    delivered: orders.filter(order => order.status === "Delivered").length,
    cancelled: orders.filter(order => order.status === "Cancelled").length,
  };

  // Redirect if not admin
  if (user && !user.isAdmin) {
    setLocation("/");
    return null;
  }

  // Generate random sample data for chart
  const getRandomData = (length: number, max: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * max));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: number, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-64 flex-shrink-0 hidden md:block">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">Manage your store</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeTab === "dashboard" ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeTab === "products" ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Products</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeTab === "orders" ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <PackageOpen className="h-5 w-5" />
            <span>Orders</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("customers")}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeTab === "customers" ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Customers</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              activeTab === "settings" ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-800">
          <Button 
            variant="outline" 
            className="w-full text-gray-300 hover:text-white border-gray-700"
            onClick={() => {
              logoutMutation.mutate();
              setLocation("/");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-gray-900 text-white z-10">
        <div className="flex justify-between p-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center justify-center p-2 rounded ${
              activeTab === "dashboard" ? "text-primary" : "text-gray-400"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex flex-col items-center justify-center p-2 rounded ${
              activeTab === "products" ? "text-primary" : "text-gray-400"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs mt-1">Products</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("orders")}
            className={`flex flex-col items-center justify-center p-2 rounded ${
              activeTab === "orders" ? "text-primary" : "text-gray-400"
            }`}
          >
            <PackageOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Orders</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("customers")}
            className={`flex flex-col items-center justify-center p-2 rounded ${
              activeTab === "customers" ? "text-primary" : "text-gray-400"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Customers</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center p-2 rounded ${
              activeTab === "settings" ? "text-primary" : "text-gray-400"
            }`}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow bg-gray-50 overflow-y-auto pb-16 md:pb-0">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "products" && "Product Management"}
                {activeTab === "orders" && "Order Management"}
                {activeTab === "customers" && "Customer Management"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/")}
              >
                View Store
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center">
                  {user?.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                      <LineChart className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      12% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      8% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                      <PackageOpen className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Check className="h-3 w-3 mr-1" />
                      {lowStockProducts} low stock items
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Order Status</CardTitle>
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orderStats.processing}</div>
                    <p className="text-xs text-amber-600 flex items-center mt-1">
                      Processing Orders
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Orders */}
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab("orders")}
                    >
                      View All
                    </Button>
                  </div>
                  <CardDescription>Overview of the latest orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingOrders ? (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                            </td>
                          </tr>
                        ) : (
                          orders.slice(0, 5).map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm">#{order.id}</td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <span 
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                                    order.status === "Processing" ? "bg-amber-100 text-amber-700" :
                                    "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm font-medium">
                                ${parseFloat(order.total.toString()).toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              {/* Low Stock Products */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Low Stock Products</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab("products")}
                    >
                      View All
                    </Button>
                  </div>
                  <CardDescription>Products with low inventory levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingProducts ? (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                            </td>
                          </tr>
                        ) : (
                          products
                            .filter(product => product.stock < 5)
                            .slice(0, 5)
                            .map((product) => (
                              <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                      <p className="text-xs text-gray-500">ID: {product.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{product.category}</td>
                                <td className="py-3 px-4 text-sm font-medium">
                                  ${parseFloat(product.price.toString()).toFixed(2)}
                                </td>
                                <td className="py-3 px-4">
                                  <span 
                                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                                      product.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {product.stock} in stock
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Products */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search products..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new product to your store.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Wireless Earbuds" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="electronics">Electronics</SelectItem>
                                  <SelectItem value="furniture">Furniture</SelectItem>
                                  <SelectItem value="home">Home</SelectItem>
                                  <SelectItem value="kitchen">Kitchen</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input placeholder="99.99" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="10"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Premium wireless earbuds with noise cancellation..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initial Rating (0-5)</FormLabel>
                              <FormControl>
                                <Input placeholder="4.5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={addProductMutation.isPending}
                            className="w-full"
                          >
                            {addProductMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding Product...
                              </>
                            ) : (
                              'Add Product'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage your store's products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rating</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingProducts ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                            </td>
                          </tr>
                        ) : filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">
                              No products found. Add a new product to get started.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm capitalize">{product.category}</td>
                              <td className="py-3 px-4 text-sm font-medium">
                                ${parseFloat(product.price.toString()).toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <span 
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    product.stock > 10 ? "bg-green-100 text-green-700" :
                                    product.stock > 0 ? "bg-amber-100 text-amber-700" :
                                    "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <div className="flex items-center">
                                  <div className="flex text-amber-400">
                                    {Array.from({ length: Math.floor(parseFloat(product.rating.toString())) }).map((_, i) => (
                                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                      </svg>
                                    ))}
                                    {parseFloat(product.rating.toString()) % 1 !== 0 && (
                                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({parseFloat(product.rating.toString()).toFixed(1)})
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600 focus:text-red-600"
                                      onClick={() => handleDeleteProduct(product.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Orders */}
          {activeTab === "orders" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search orders..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="hidden md:flex items-center space-x-4">
                  <Tabs defaultValue="all" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="processing">Processing</TabsTrigger>
                      <TabsTrigger value="shipped">Shipped</TabsTrigger>
                      <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Manage your store's orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoadingOrders ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                            </td>
                          </tr>
                        ) : filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">
                              No orders found.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm">#{order.id}</td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                Customer #{order.userId}
                              </td>
                              <td className="py-3 px-4">
                                <span 
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                    order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                                    order.status === "Processing" ? "bg-amber-100 text-amber-700" :
                                    "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm font-medium">
                                ${parseFloat(order.total.toString()).toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateOrderStatus(order.id, "Processing")}
                                      disabled={order.status === "Processing"}
                                    >
                                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
                                      Mark as Processing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateOrderStatus(order.id, "Shipped")}
                                      disabled={order.status === "Shipped"}
                                    >
                                      <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                                      Mark as Shipped
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                                      disabled={order.status === "Delivered"}
                                    >
                                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                      Mark as Delivered
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}
                                      disabled={order.status === "Cancelled"}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                                      Cancel Order
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Details Dialog */}
              <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                      Details for Order #{selectedOrder?.id}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedOrder && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
                          <p>#{selectedOrder.id}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
                          <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                          <p>Customer #{selectedOrder.userId}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                        <div className="border rounded-md">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2 text-sm font-medium text-gray-500">Product</th>
                                <th className="text-center p-2 text-sm font-medium text-gray-500">Quantity</th>
                                <th className="text-right p-2 text-sm font-medium text-gray-500">Price</th>
                                <th className="text-right p-2 text-sm font-medium text-gray-500">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.items?.map((item: any) => (
                                <tr key={item.id} className="border-b last:border-b-0">
                                  <td className="p-2 text-sm">
                                    Product #{item.productId}
                                  </td>
                                  <td className="p-2 text-sm text-center">{item.quantity}</td>
                                  <td className="p-2 text-sm text-right">
                                    ${parseFloat(item.price.toString()).toFixed(2)}
                                  </td>
                                  <td className="p-2 text-sm text-right font-medium">
                                    ${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                        <div>
                          <span className="text-sm text-gray-500">Total Amount</span>
                        </div>
                        <div className="text-xl font-bold">
                          ${parseFloat(selectedOrder.total.toString()).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter className="flex gap-2">
                    <Button
                      onClick={() => setIsViewOrderOpen(false)}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Customers */}
          {activeTab === "customers" && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>This feature is under development</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    The customer management feature is currently under development and will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Settings */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Manage your store settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="taxes">Taxes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general" className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" defaultValue="ShopEase" />
                      </div>
                      <div>
                        <Label htmlFor="store-email">Store Email</Label>
                        <Input id="store-email" defaultValue="support@shopease.com" />
                      </div>
                      <div>
                        <Label htmlFor="store-phone">Store Phone</Label>
                        <Input id="store-phone" defaultValue="(123) 456-7890" />
                      </div>
                      <div>
                        <Label htmlFor="store-address">Store Address</Label>
                        <Textarea id="store-address" defaultValue="123 Commerce St, Market City" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="p-4 flex items-center justify-center min-h-[200px] text-center">
                    <div>
                      <p className="text-gray-500">Shipping settings are not yet implemented.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payments" className="p-4 flex items-center justify-center min-h-[200px] text-center">
                    <div>
                      <p className="text-gray-500">Payment settings are not yet implemented.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="taxes" className="p-4 flex items-center justify-center min-h-[200px] text-center">
                    <div>
                      <p className="text-gray-500">Tax settings are not yet implemented.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
