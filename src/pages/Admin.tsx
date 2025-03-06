
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { products } from "@/data/products";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Trash2,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Admin Table component
const ProductsTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="hidden md:table-cell">{product.sku || `SKU-${product.id}`}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Mock add product form
const AddProductForm = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Product Name</label>
          <Input id="name" placeholder="Enter product name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <Input id="category" placeholder="Enter category" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea 
          id="description" 
          className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter product description"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">Price</label>
          <Input id="price" type="number" placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <label htmlFor="sku" className="text-sm font-medium">SKU</label>
          <Input id="sku" placeholder="Enter SKU" />
        </div>
        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium">Stock</label>
          <Input id="stock" type="number" placeholder="0" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">Product Image</label>
        <Input id="image" type="file" className="cursor-pointer" />
      </div>
      
      <Button disabled>Add Product</Button>
      <p className="text-xs text-muted-foreground">
        Product addition is disabled in this demo
      </p>
    </div>
  );
};

// Admin Dashboard Tabs
enum AdminTab {
  Dashboard = "dashboard",
  Products = "products",
  AddProduct = "add-product",
}

const Admin = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.Dashboard);
  
  // Redirect non-admins
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="-ml-4" onClick={() => navigate("/account")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">
            Logged in as <span className="font-medium">{user?.name}</span>
          </span>
        </div>
      </div>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === AdminTab.Dashboard
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab(AdminTab.Dashboard)}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === AdminTab.Products
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab(AdminTab.Products)}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === AdminTab.AddProduct
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab(AdminTab.AddProduct)}
        >
          Add Product
        </button>
      </div>
      
      {activeTab === AdminTab.Dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {new Set(products.map(p => p.category)).size} categories
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">
                1 admin, 1 regular user
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                No orders yet
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === AdminTab.Products && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Management</h2>
            <Button
              onClick={() => setActiveTab(AdminTab.AddProduct)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
          <ProductsTable />
        </div>
      )}
      
      {activeTab === AdminTab.AddProduct && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <AddProductForm />
        </div>
      )}
    </div>
  );
};

export default Admin;
