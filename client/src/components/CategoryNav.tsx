import { categories, type Category } from "@/types/player";
import { Button } from "@/components/ui/button";

interface CategoryNavProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function CategoryNav({ currentCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="bg-muted border-b border-border sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide space-x-1 py-3">
          {Object.entries(categories).map(([key, category]) => (
            <Button
              key={key}
              variant={currentCategory === key ? "secondary" : "ghost"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                currentCategory === key ? 'bg-secondary text-foreground' : 'hover:bg-secondary'
              }`}
              onClick={() => onCategoryChange(key as Category)}
              data-testid={`button-category-${key}`}
            >
              <i className={`${category.icon} ${category.color} text-sm`} />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
