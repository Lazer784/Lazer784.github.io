import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, Star, Plus, Minus, Heart, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Loader2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardFooter } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// API service functions
const apiService = {
  async fetchProducts(category = null, search = null) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await fetch(`${API_BASE_URL}/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return SAMPLE_PRODUCTS; // Fallback to sample data
    }
  },

  async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return CATEGORIES; // Fallback to sample data
    }
  }
};

// Sample product data with the curated images (fallback)
const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Basmati Rice',
    category: 'rice',
    price: 180,
    originalPrice: 200,
    image: 'https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zfGVufDB8fHx8MTc1NTE4NDk5Nnww&ixlib=rb-4.1.0&q=85',
    description: 'Finest quality aged Basmati rice from the foothills of Himalayas. Perfect for biryanis and special occasions.',
    weight: '5kg',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    organic: false
  },
  {
    id: '2',
    name: 'Traditional Rice Varieties',
    category: 'rice',
    price: 120,
    originalPrice: 140,
    image: 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg',
    description: 'Mix of traditional South Indian rice varieties including red rice, brown rice, and wild rice.',
    weight: '3kg',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    organic: true
  },
  {
    id: '3',
    name: 'Chinnodu Special Spice Mix',
    category: 'spices',
    price: 85,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXN8ZW58MHx8fHwxNzU1MTg1MDAyfDA&ixlib=rb-4.1.0&q=85',
    description: 'Authentic blend of South Indian spices. Perfect for traditional curries and sambar.',
    weight: '500g',
    rating: 4.9,
    reviews: 234,
    inStock: true,
    organic: false
  },
  {
    id: '4',
    name: 'Organic Cold-Pressed Oil',
    category: 'oils',
    price: 320,
    originalPrice: 360,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxyaWNlJTIwZ3JhaW5zfGVufDB8fHx8MTc1NTE4NDk5Nnww&ixlib=rb-4.1.0&q=85',
    description: 'Pure organic sesame oil extracted using traditional cold-press methods.',
    weight: '1L',
    rating: 4.7,
    reviews: 92,
    inStock: true,
    organic: true
  },
  {
    id: '5',
    name: 'Premium Spice Collection',
    category: 'spices',
    price: 450,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1656497119922-068c6a5e1193?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzcGljZXN8ZW58MHx8fHwxNzU1MTg1MDAyfDA&ixlib=rb-4.1.0&q=85',
    description: 'Curated collection of 12 essential South Indian spices in traditional containers.',
    weight: '2kg',
    rating: 4.8,
    reviews: 167,
    inStock: true,
    organic: false
  },
  {
    id: '6',
    name: 'Organic Heritage Rice',
    category: 'rice',
    price: 250,
    originalPrice: 280,
    image: 'https://images.unsplash.com/photo-1645331465778-eb409d112198?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxyaWNlJTIwZ3JhaW5zfGVufDB8fHx8MTc1NTE4NDk5Nnww&ixlib=rb-4.1.0&q=85',
    description: 'Rare heritage variety rice grown using traditional organic methods in Andhra Pradesh.',
    weight: '5kg',
    rating: 4.9,
    reviews: 78,
    inStock: true,
    organic: true
  }
];

const CATEGORIES = [
  { id: 'rice', name: 'Rice & Grains', icon: '🌾' },
  { id: 'spices', name: 'Spices & Masalas', icon: '🌶️' },
  { id: 'oils', name: 'Oils & Ghee', icon: '🫒' },
  { id: 'organic', name: 'Organic Products', icon: '🌱' },
  { id: 'ready-to-cook', name: 'Ready to Cook', icon: '🍽️' }
];

function Header({ cartItems, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-800">Chinnodu Foods</h1>
              <p className="text-xs text-orange-600 font-medium">Tirupati's Premium Food Brand</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for rice, spices, oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-amber-100 focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2 text-amber-800 hover:text-amber-600">
              <User className="h-4 w-4" />
              <span>Account</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-2 text-amber-800 hover:text-amber-600 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Cart</span>
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-600">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for rice, spices, oils..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-amber-100 focus:border-amber-400"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-amber-100">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-amber-800 hover:text-amber-600 font-medium">Home</Link>
              <Link to="/products" className="text-amber-800 hover:text-amber-600 font-medium">Products</Link>
              <Link to="/cart" className="text-amber-800 hover:text-amber-600 font-medium">Cart</Link>
              <Link to="#" className="text-amber-800 hover:text-amber-600 font-medium">Account</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function HomePage({ addToCart }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setLoading(true);
      const allProducts = await apiService.fetchProducts();
      setProducts(allProducts.slice(0, 3)); // Get first 3 for featured
      setLoading(false);
    };
    loadFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6 leading-tight">
              Premium
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Traditional </span>
              Foods
            </h2>
            <p className="text-xl md:text-2xl text-amber-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              From the sacred hills of Tirupati, bringing you the finest rice, spices, and traditional foods with trust and quality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-amber-600 text-amber-800 hover:bg-amber-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-amber-900 text-center mb-12">Shop by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {CATEGORIES.map((category) => (
              <Card 
                key={category.id} 
                onClick={() => navigate(`/products?category=${category.id}`)}
                className="cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-amber-50 border-2 border-amber-100 hover:border-amber-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h4 className="font-semibold text-amber-800 text-lg">{category.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-amber-900 text-center mb-12">Featured Products</h3>
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <span className="ml-2 text-amber-700">Loading products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-100 hover:border-amber-300 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.organic && (
                      <Badge className="absolute top-2 right-2 bg-green-600">Organic</Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg text-amber-900 mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-amber-800">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{product.weight}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/products')}
              size="lg"
              variant="outline"
              className="border-2 border-amber-600 text-amber-800 hover:bg-amber-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage({ addToCart, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [searchParams] = new URLSearchParams(window.location.search);

  useEffect(() => {
    // Set category from URL parameter
    const categoryFromURL = searchParams.get('category');
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        apiService.fetchProducts(selectedCategory, searchQuery),
        apiService.fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    };
    loadData();
  }, [selectedCategory, searchQuery]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-amber-700">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card className="border-2 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    onClick={() => setSelectedCategory('all')}
                    className="w-full justify-start"
                  >
                    All Products
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'ghost'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full justify-start"
                    >
                      {category.icon} {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-900 mb-4">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-900">
                {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-gray-600">{sortedProducts.length} products found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => (
                <Card key={product.id} className="hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-100 hover:border-amber-300 overflow-hidden bg-white">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.organic && (
                      <Badge className="absolute top-2 right-2 bg-green-600">Organic</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-lg text-amber-900 mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-amber-800">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{product.weight}</span>
                    </div>
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-full"
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPage({ cartItems, updateCartItem, removeFromCart }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCheckout = (e) => {
    e.preventDefault();
    // Here you would integrate with payment gateway
    alert('Order placed successfully! You will receive a confirmation email shortly.');
    setIsCheckoutOpen(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
        <div className="container mx-auto text-center py-16">
          <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
          <Link to="/products">
            <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="border-2 border-amber-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-amber-900">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.weight}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold text-amber-800">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItem(item.id, Math.max(0, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateCartItem(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-amber-800">₹{item.price * item.quantity}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-2 border-amber-100 bg-white sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl text-amber-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-sm text-green-600">Free shipping on orders over ₹500!</p>
                  )}
                  <div className="border-t border-amber-100 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-amber-800">₹{total}</span>
                    </div>
                  </div>
                </div>
                
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-full">
                      Proceed to Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-amber-900">Checkout</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={checkoutForm.name}
                            onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={checkoutForm.phone}
                            onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={checkoutForm.address}
                          onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={checkoutForm.city}
                            onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            id="pincode"
                            value={checkoutForm.pincode}
                            onChange={(e) => setCheckoutForm({...checkoutForm, pincode: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-amber-900 mb-2">Order Total: ₹{total}</h4>
                        <p className="text-sm text-amber-700">Payment will be collected on delivery (Cash on Delivery)</p>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                        Place Order
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-amber-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <h3 className="text-xl font-bold">Chinnodu Foods</h3>
            </div>
            <p className="text-amber-100 text-sm">
              Premium traditional foods from Tirupati, bringing you authentic taste with modern convenience.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-amber-100">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-amber-100">
              <li><Link to="/products?category=rice" className="hover:text-white transition-colors">Rice & Grains</Link></li>
              <li><Link to="/products?category=spices" className="hover:text-white transition-colors">Spices & Masalas</Link></li>
              <li><Link to="/products?category=oils" className="hover:text-white transition-colors">Oils & Ghee</Link></li>
              <li><Link to="/products?category=organic" className="hover:text-white transition-colors">Organic Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-2 text-amber-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Tirupati, Andhra Pradesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@chinnodufoods.com</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="ghost" size="sm" className="text-amber-100 hover:text-white hover:bg-amber-800 p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-amber-100 hover:text-white hover:bg-amber-800 p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-amber-100 hover:text-white hover:bg-amber-800 p-2">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-800 mt-8 pt-8 text-center">
          <p className="text-amber-100 text-sm">
            © 2025 Chinnodu Foods. All rights reserved. Made with ❤️ in Tirupati
          </p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial load
    const savedCart = localStorage.getItem('chinnoduCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chinnoduCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div className="App">
        <Header cartItems={cartItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<HomePage addToCart={addToCart} />} />
          <Route path="/products" element={<ProductsPage addToCart={addToCart} searchQuery={searchQuery} />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} updateCartItem={updateCartItem} removeFromCart={removeFromCart} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;