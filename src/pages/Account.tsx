
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Account = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="bg-muted rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-sm inline-block bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
              {user.role}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-secondary p-4 border-b">
            <h3 className="font-medium">Order History</h3>
          </div>
          <div className="p-6 text-center text-muted-foreground">
            <p>You haven't placed any orders yet.</p>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-secondary p-4 border-b">
            <h3 className="font-medium">Account Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="rounded-md border w-full p-2 bg-muted"
                value={user.name}
                disabled
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="rounded-md border w-full p-2 bg-muted"
                value={user.email}
                disabled
              />
            </div>
            <Button disabled className="w-full">
              Update Profile
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Profile updates are disabled in this demo
            </p>
          </div>
        </div>
      </div>
      
      {user.role === "admin" && (
        <div className="mt-8 p-4 border-t">
          <h3 className="font-medium mb-4">Admin Functions</h3>
          <Button onClick={() => navigate("/admin")} className="gap-2">
            Go to Admin Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Account;
