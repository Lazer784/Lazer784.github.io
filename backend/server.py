from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from datetime import datetime
import uuid

app = FastAPI(title="Chinnodu Foods API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client.chinnodu_foods

# Pydantic models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    image: str
    description: str
    weight: str
    rating: float = 0.0
    reviews: int = 0
    inStock: bool = True
    organic: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CartItem(BaseModel):
    product_id: str
    quantity: int

class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    address: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    items: List[dict]
    subtotal: float
    shipping: float
    total: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    delivery_address: dict

# Initialize with sample data
@app.on_event("startup")
async def startup_event():
    # Check if products collection is empty and populate with sample data
    if db.products.count_documents({}) == 0:
        sample_products = [
            {
                "id": "1",
                "name": "Premium Basmati Rice",
                "category": "rice",
                "price": 180,
                "originalPrice": 200,
                "image": "https://images.unsplash.com/photo-1686820740687-426a7b9b2043?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxyaWNlJTIwZ3JhaW5zfGVufDB8fHx8MTc1NTE4NDk5Nnww&ixlib=rb-4.1.0&q=85",
                "description": "Finest quality aged Basmati rice from the foothills of Himalayas. Perfect for biryanis and special occasions.",
                "weight": "5kg",
                "rating": 4.8,
                "reviews": 156,
                "inStock": True,
                "organic": False,
                "created_at": datetime.utcnow()
            },
            {
                "id": "2",
                "name": "Traditional Rice Varieties",
                "category": "rice",
                "price": 120,
                "originalPrice": 140,
                "image": "https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg",
                "description": "Mix of traditional South Indian rice varieties including red rice, brown rice, and wild rice.",
                "weight": "3kg",
                "rating": 4.6,
                "reviews": 89,
                "inStock": True,
                "organic": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": "3",
                "name": "Chinnodu Special Spice Mix",
                "category": "spices",
                "price": 85,
                "originalPrice": 95,
                "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXN8ZW58MHx8fHwxNzU1MTg1MDAyfDA&ixlib=rb-4.1.0&q=85",
                "description": "Authentic blend of South Indian spices. Perfect for traditional curries and sambar.",
                "weight": "500g",
                "rating": 4.9,
                "reviews": 234,
                "inStock": True,
                "organic": False,
                "created_at": datetime.utcnow()
            },
            {
                "id": "4",
                "name": "Organic Cold-Pressed Oil",
                "category": "oils",
                "price": 320,
                "originalPrice": 360,
                "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxyaWNlJTIwZ3JhaW5zfGVufDB8fHx8MTc1NTE4NDk5Nnww&ixlib=rb-4.1.0&q=85",
                "description": "Pure organic sesame oil extracted using traditional cold-press methods.",
                "weight": "1L",
                "rating": 4.7,
                "reviews": 92,
                "inStock": True,
                "organic": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": "5",
                "name": "Premium Spice Collection",
                "category": "spices",
                "price": 450,
                "originalPrice": 500,
                "image": "https://images.unsplash.com/photo-1656497119922-068c6a5e1193?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBzcGljZXN8ZW58MHx8fHwxNzU1MTg1MDAyfDA&ixlib=rb-4.1.0&q=85",
                "description": "Curated collection of 12 essential South Indian spices in traditional containers.",
                "weight": "2kg",
                "rating": 4.8,
                "reviews": 167,
                "inStock": True,
                "organic": False,
                "created_at": datetime.utcnow()
            },
            {
                "id": "6",
                "name": "Organic Heritage Rice",
                "category": "rice",
                "price": 250,
                "originalPrice": 280,
                "image": "https://images.unsplash.com/photo-1645331465778-eb409d112198?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxyaWNlJTIwZ3JhaW5zfGVufDB8fHx8MTc1NTE4NDk5Nnww&ixlib=rb-4.1.0&q=85",
                "description": "Rare heritage variety rice grown using traditional organic methods in Andhra Pradesh.",
                "weight": "5kg",
                "rating": 4.9,
                "reviews": 78,
                "inStock": True,
                "organic": True,
                "created_at": datetime.utcnow()
            }
        ]
        db.products.insert_many(sample_products)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Chinnodu Foods API is running"}

# Product endpoints
@app.get("/api/products")
async def get_products(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    products = list(db.products.find(query, {"_id": 0}))
    return {"products": products}

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products")
async def create_product(product: Product):
    product_dict = product.dict()
    db.products.insert_one(product_dict)
    return {"message": "Product created successfully", "product": product_dict}

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product: Product):
    product_dict = product.dict()
    result = db.products.update_one(
        {"id": product_id}, 
        {"$set": product_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product updated successfully"}

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str):
    result = db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Categories endpoint
@app.get("/api/categories")
async def get_categories():
    categories = [
        {"id": "rice", "name": "Rice & Grains", "icon": "🌾"},
        {"id": "spices", "name": "Spices & Masalas", "icon": "🌶️"},
        {"id": "oils", "name": "Oils & Ghee", "icon": "🫒"},
        {"id": "organic", "name": "Organic Products", "icon": "🌱"},
        {"id": "ready-to-cook", "name": "Ready to Cook", "icon": "🍽️"}
    ]
    return {"categories": categories}

# Customer endpoints
@app.post("/api/customers")
async def create_customer(customer: Customer):
    # Check if customer with email already exists
    existing_customer = db.customers.find_one({"email": customer.email}, {"_id": 0})
    if existing_customer:
        return {"message": "Customer already exists", "customer": existing_customer}
    
    customer_dict = customer.dict()
    db.customers.insert_one(customer_dict)
    return {"message": "Customer created successfully", "customer": customer_dict}

@app.get("/api/customers/{customer_id}")
async def get_customer(customer_id: str):
    customer = db.customers.find_one({"id": customer_id}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

# Order endpoints
@app.post("/api/orders")
async def create_order(order: Order):
    order_dict = order.dict()
    db.orders.insert_one(order_dict)
    return {"message": "Order created successfully", "order": order_dict}

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str):
    order = db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.get("/api/orders/customer/{customer_id}")
async def get_customer_orders(customer_id: str):
    orders = list(db.orders.find({"customer_id": customer_id}, {"_id": 0}).sort("created_at", -1))
    return {"orders": orders}

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, status: dict):
    result = db.orders.update_one(
        {"id": order_id}, 
        {"$set": {"status": status["status"]}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated successfully"}

# Search endpoint
@app.get("/api/search")
async def search_products(q: str):
    products = list(db.products.find({
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}}
        ]
    }, {"_id": 0}))
    return {"products": products, "query": q}

# Statistics endpoint (for future admin dashboard)
@app.get("/api/stats")
async def get_stats():
    total_products = db.products.count_documents({})
    total_customers = db.customers.count_documents({})
    total_orders = db.orders.count_documents({})
    pending_orders = db.orders.count_documents({"status": "pending"})
    
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "pending_orders": pending_orders
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)