import { products, users, orders, orderItems } from "@shared/schema";
import type { 
  User, InsertUser, 
  Product, InsertProduct, 
  Order, InsertOrder, 
  OrderItem, InsertOrderItem 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private productStore: Map<number, Product>;
  private orderStore: Map<number, Order>;
  private orderItemStore: Map<number, OrderItem>;
  private userIdCounter: number;
  private productIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.userStore = new Map();
    this.productStore = new Map();
    this.orderStore = new Map();
    this.orderItemStore = new Map();
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });

    // Seed initial products
    this.seedProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.userStore.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.productStore.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.productStore.get(id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...productData, id };
    this.productStore.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.productStore.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData };
    this.productStore.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productStore.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orderStore.values());
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orderStore.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orderStore.get(id);
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const order: Order = { ...orderData, id, createdAt: new Date() };
    this.orderStore.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orderStore.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orderStore.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemStore.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const orderItem: OrderItem = { ...orderItemData, id };
    this.orderItemStore.set(id, orderItem);
    return orderItem;
  }

  // Seed method for initial data
  private seedProducts() {
    const productsData: InsertProduct[] = [
      {
        name: "Wireless Earbuds",
        price: "129.99",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Premium wireless earbuds with noise cancellation and long battery life.",
        stock: 15,
        rating: "4.5"
      },
      {
        name: "Fitness Smartwatch",
        price: "199.99",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
        stock: 8,
        rating: "4.3"
      },
      {
        name: "Ergonomic Office Chair",
        price: "249.99",
        category: "furniture",
        image: "https://images.unsplash.com/photo-1505797149328-8bbd4d77bacb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Comfortable ergonomic chair perfect for home office and long working hours.",
        stock: 5,
        rating: "4.7"
      },
      {
        name: "Minimalist Desk Lamp",
        price: "59.99",
        category: "home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Adjustable desk lamp with eye-caring technology and modern design.",
        stock: 20,
        rating: "4.2"
      },
      {
        name: "Premium Coffee Maker",
        price: "149.99",
        category: "kitchen",
        image: "https://images.unsplash.com/photo-1571091655789-405127f7894f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Programmable coffee maker that brews the perfect cup every time.",
        stock: 12,
        rating: "4.8"
      },
      {
        name: "Bluetooth Speaker",
        price: "89.99",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Portable Bluetooth speaker with 360° sound and waterproof design.",
        stock: 10,
        rating: "4.1"
      },
      {
        name: "Indoor Plant Set",
        price: "49.99",
        category: "home",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Set of 3 easy-care indoor plants in decorative pots.",
        stock: 7,
        rating: "4.4"
      },
      {
        name: "Digital Drawing Tablet",
        price: "179.99",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1574875139452-e687c9ab24e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        description: "Professional graphics tablet with pressure sensitivity for digital artists.",
        stock: 4,
        rating: "4.6"
      }
    ];

    productsData.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();
