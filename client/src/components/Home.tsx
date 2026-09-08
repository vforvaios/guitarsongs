import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categories";

const Home = () => {
  const { data, isError, error } = useQuery({
    queryKey: ["song_categories"],
    queryFn: () => {
      return getCategories();
    },
  });

  return (
    <div>
      {data?.categories?.map((songCategory: any) => (
        <div key={songCategory.id}>{songCategory.name}</div>
      ))}
    </div>
  );
};

export default Home;
