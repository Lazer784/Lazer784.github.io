import requests
import sys
import json
from datetime import datetime

class ChinnoduFoodsAPITester:
    def __init__(self, base_url="https://chinnodu-foods.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_get_products(self):
        """Test get all products"""
        success, response = self.run_test("Get All Products", "GET", "api/products", 200)
        if success and isinstance(response, dict) and 'products' in response:
            products = response['products']
            print(f"   Found {len(products)} products")
            if len(products) > 0:
                print(f"   Sample product: {products[0]['name']}")
            return True, products
        return False, []

    def test_get_products_by_category(self):
        """Test get products by category"""
        categories = ['rice', 'spices', 'oils']
        for category in categories:
            success, response = self.run_test(
                f"Get Products - Category: {category}", 
                "GET", 
                "api/products", 
                200, 
                params={'category': category}
            )
            if success and isinstance(response, dict):
                products = response.get('products', [])
                print(f"   Found {len(products)} products in {category} category")

    def test_search_products(self):
        """Test product search"""
        search_terms = ['rice', 'spice', 'organic']
        for term in search_terms:
            success, response = self.run_test(
                f"Search Products - '{term}'", 
                "GET", 
                "api/products", 
                200, 
                params={'search': term}
            )
            if success and isinstance(response, dict):
                products = response.get('products', [])
                print(f"   Found {len(products)} products for search '{term}'")

    def test_get_single_product(self, product_id="1"):
        """Test get single product"""
        return self.run_test(f"Get Product ID: {product_id}", "GET", f"api/products/{product_id}", 200)

    def test_get_categories(self):
        """Test get categories"""
        success, response = self.run_test("Get Categories", "GET", "api/categories", 200)
        if success and isinstance(response, dict) and 'categories' in response:
            categories = response['categories']
            print(f"   Found {len(categories)} categories")
            for cat in categories:
                print(f"   - {cat['name']} ({cat['id']})")
        return success, response

    def test_search_endpoint(self):
        """Test dedicated search endpoint"""
        return self.run_test("Search Endpoint", "GET", "api/search", 200, params={'q': 'rice'})

    def test_stats_endpoint(self):
        """Test statistics endpoint"""
        success, response = self.run_test("Statistics", "GET", "api/stats", 200)
        if success and isinstance(response, dict):
            print(f"   Total products: {response.get('total_products', 'N/A')}")
            print(f"   Total customers: {response.get('total_customers', 'N/A')}")
            print(f"   Total orders: {response.get('total_orders', 'N/A')}")
        return success, response

    def test_create_customer(self):
        """Test customer creation"""
        customer_data = {
            "name": "Test Customer",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "9876543210",
            "address": "Test Address",
            "city": "Tirupati",
            "pincode": "517501"
        }
        success, response = self.run_test("Create Customer", "POST", "api/customers", 200, data=customer_data)
        if success and isinstance(response, dict) and 'customer' in response:
            customer_id = response['customer'].get('id')
            print(f"   Created customer with ID: {customer_id}")
            return True, customer_id
        return False, None

    def test_create_order(self, customer_id):
        """Test order creation"""
        if not customer_id:
            self.log_test("Create Order", False, "No customer ID available")
            return False, None
            
        order_data = {
            "customer_id": customer_id,
            "items": [
                {"product_id": "1", "quantity": 2, "price": 180},
                {"product_id": "3", "quantity": 1, "price": 85}
            ],
            "subtotal": 445,
            "shipping": 0,
            "total": 445,
            "delivery_address": {
                "name": "Test Customer",
                "address": "Test Address",
                "city": "Tirupati",
                "pincode": "517501"
            }
        }
        success, response = self.run_test("Create Order", "POST", "api/orders", 200, data=order_data)
        if success and isinstance(response, dict) and 'order' in response:
            order_id = response['order'].get('id')
            print(f"   Created order with ID: {order_id}")
            return True, order_id
        return False, None

    def test_get_order(self, order_id):
        """Test get order by ID"""
        if not order_id:
            self.log_test("Get Order", False, "No order ID available")
            return False, None
        return self.run_test(f"Get Order ID: {order_id}", "GET", f"api/orders/{order_id}", 200)

    def test_get_customer_orders(self, customer_id):
        """Test get customer orders"""
        if not customer_id:
            self.log_test("Get Customer Orders", False, "No customer ID available")
            return False, None
        return self.run_test(f"Get Customer Orders", "GET", f"api/orders/customer/{customer_id}", 200)

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Chinnodu Foods API Tests")
        print("=" * 50)
        
        # Basic health and product tests
        self.test_health_check()
        success, products = self.test_get_products()
        self.test_get_products_by_category()
        self.test_search_products()
        
        # Test single product if products exist
        if products and len(products) > 0:
            self.test_get_single_product(products[0]['id'])
        else:
            self.test_get_single_product()
        
        self.test_get_categories()
        self.test_search_endpoint()
        self.test_stats_endpoint()
        
        # Customer and order workflow tests
        success, customer_id = self.test_create_customer()
        success, order_id = self.test_create_order(customer_id)
        self.test_get_order(order_id)
        self.test_get_customer_orders(customer_id)
        
        # Print final results
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 50)
        print(f"Total tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend API is working correctly.")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['name']}: {result['details']}")
            return 1

def main():
    tester = ChinnoduFoodsAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())