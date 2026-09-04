export default function FoodCategoryCard({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  return (
    <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`shrink-0 w-24 sm:w-28 rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
            activeCategory === cat.name
              ? "border-[#E0722C]"
              : "border-transparent"
          }`}
          onClick={() => setActiveCategory(cat.name)}>
          <img
            className="w-full h-16 sm:h-20 object-cover"
            src={cat.photo}
            alt={cat.name}
          />
          <div
            className={`text-center text-xs sm:text-sm font-medium py-1.5 truncate px-1 ${
              activeCategory === cat.name
                ? "bg-[#E0722C] text-white"
                : "bg-white text-[#8C7E68]"
            }`}>
            {cat.name}
          </div>
        </div>
      ))}
    </div>
  );
}
