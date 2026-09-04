export function FoodCard({ activeCategory, cart, updateQuantity, food_menu }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {food_menu
        .filter((m) => m.category === activeCategory)
        .map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="rounded-xl bg-white border border-[#C08552]/30 shadow-sm overflow-hidden flex flex-col">
              <img
                className="w-full h-28 sm:h-36 md:h-40 object-cover"
                src={item.food_img}
                alt={item.name}
              />
              <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                <h2 className="font-semibold text-[#4B2E2B] text-sm sm:text-base truncate">
                  {item.name}
                </h2>
                <p className="text-sm font-semibold text-[#C08552] mt-auto">
                  ₱{Number(item.price).toFixed(2)}
                </p>

                {qty === 0 ? (
                  <button
                    className="btn btn-sm bg-[#C08552] hover:bg-[#8C5A3C] text-white border-none w-full"
                    onClick={() => updateQuantity(item.id, 1)}>
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2 w-full">
                    <button
                      className="btn btn-sm bg-[#C08552]/10 hover:bg-[#B4432F] hover:text-white text-[#8C5A3C] border-none"
                      onClick={() => updateQuantity(item.id, -1)}>
                      -
                    </button>
                    <span className="font-semibold text-[#4B2E2B] tabular-nums">
                      {qty}
                    </span>
                    <button
                      className="btn btn-sm bg-[#C08552]/10 hover:bg-[#C08552] hover:text-white text-[#8C5A3C] border-none"
                      onClick={() => updateQuantity(item.id, 1)}>
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
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
              ? "border-[#C08552]"
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
                ? "bg-[#C08552] text-white"
                : "bg-white text-[#8C5A3C]"
            }`}>
            {cat.name}
          </div>
        </div>
      ))}
    </div>
  );
}
