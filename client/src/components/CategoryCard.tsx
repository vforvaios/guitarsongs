import { ArrowRight, GuitarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }: { category: any }) => {
  const navigate = useNavigate();

  return (
    <button
      className="category-card"
      onClick={() => navigate(`/categories/${category.id}`)}
    >
      <div className="category-icon" style={{ backgroundColor: "#f73a3a" }}>
        <GuitarIcon />
      </div>

      <div className="category-info">
        <strong>{category.name}</strong>
      </div>

      <ArrowRight size={20} className="category-arrow" />
    </button>
  );
};

export default CategoryCard;
