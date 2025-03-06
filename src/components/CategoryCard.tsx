
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  category: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src="/placeholder.svg"
          alt={category}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-medium">{category}</h3>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
