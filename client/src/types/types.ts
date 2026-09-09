export type Category = {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
};

export type Song = {
  title: string;
  artist: string;
  key: string;
  category: string;
  categoryType: "greek" | "foreign";
  image: string;
};
