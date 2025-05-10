
import React from 'react';
import { World, WorldCategory } from "@/types";

interface WorldDetailProps {
  world: World;
  onBack: () => void;
  onEditWorld: () => void;
  onDeleteWorld: () => void;
  onDuplicateWorld?: () => void;
  onAddCategory: () => void;
  onEditCategory: (category: WorldCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (categories: WorldCategory[]) => void;
}

// This is a stub component that would be expanded with the full implementation
const WorldDetail = ({
  world,
  onBack,
  onEditWorld,
  onDeleteWorld,
  onDuplicateWorld,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories
}: WorldDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{world.name}</h1>
        <button onClick={onBack} className="px-3 py-1 border rounded">Back</button>
      </div>
      <p className="text-muted-foreground">{world.description}</p>
      
      <div className="flex space-x-2">
        <button onClick={onEditWorld} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
        <button onClick={onDeleteWorld} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
        {onDuplicateWorld && (
          <button onClick={onDuplicateWorld} className="px-3 py-1 bg-green-500 text-white rounded">Duplicate</button>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <button onClick={onAddCategory} className="px-3 py-1 bg-anime-purple text-white rounded">Add Category</button>
        </div>
        
        <div className="space-y-3">
          {world.categories.map((category) => (
            <div key={category.id} className="border p-3 rounded flex justify-between items-center">
              <span>{category.name}</span>
              <div className="space-x-2">
                <button onClick={() => onEditCategory(category)} className="px-2 py-1 bg-blue-500 text-white rounded-sm text-xs">Edit</button>
                <button onClick={() => onDeleteCategory(category.id)} className="px-2 py-1 bg-red-500 text-white rounded-sm text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorldDetail;
