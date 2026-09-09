import { ArrowRight } from "lucide-react";

const CategoryCard = ({ category }: { category: any }) => {
  return (
    <button className="category-card">
      <div
        className="category-icon"
        style={{
          backgroundColor: "#fff",
        }}
      >
        Hi
      </div>

      <div className="category-info">
        <strong>{category.name}</strong>
      </div>

      <ArrowRight size={20} className="category-arrow" />
    </button>
  );
};

export default CategoryCard;
