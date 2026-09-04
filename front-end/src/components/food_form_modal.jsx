import { useState, useEffect } from "react";
import { CreateFood, UpdateFood, GetFoodById } from "../services/food_service";
import { LoadCategories } from "../services/category_service";

function FoodFormModal({ modal_id, food_id, setFoods }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    food_img: null,
    is_active: false,
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(food_id);

  useEffect(() => {
    if (!isEditMode) return;

    async function GetSpecificFood() {
      try {
        setLoading(true);
        const data = await GetFoodById(food_id);

        setForm({
          name: data.name ?? "",
          category: data.category_id ?? "",
          price: data.price ?? "",
          food_img: data.food_img ?? null,
          is_active: data.is_active ?? false,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    GetSpecificFood();
  }, [isEditMode, food_id]);

  useEffect(() => {
    async function GetCategories() {
      try {
        setLoading(true);
        const data = await LoadCategories();
        setCategories(data.results);
      } catch (err) {
        console.error("HandleSubmit error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    GetCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "price" && value.length > 10) return;

    if (name === "food_img") {
      setForm((prev) => ({ ...prev, food_img: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function HandleSubmit(e) {
    e.preventDefault();
    setError({});
    setLoading(true);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("category", form.category);
    payload.append("price", form.price);
    payload.append("price", form.price);
    payload.append("is_active", true);

    if (form.food_img && typeof form.food_img !== "string") {
      payload.append("food_img", form.food_img);
    }
    try {
      let data;
      if (isEditMode) {
        data = await UpdateFood(payload, food_id);
        setFoods((prev) =>
          prev.map((food) => (food.id === data.id ? data : food)),
        );
      } else {
        data = await CreateFood(payload);
        setFoods((prev) => [...prev, data]);
      }

      ClearFields();
      document.getElementById(modal_id).close();
    } catch (err) {
      console.log("Validation errors:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  function ClearFields() {
    setError({});
    setForm({
      name: "",
      category: "",
      price: "",
      food_img: null,
    });
  }

  return (
    <>
      <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-lg bg-[#FFF8F0]">
          <h3 className="text-lg font-semibold text-[#4B2E2B] mb-4">
            {isEditMode ? "Edit Food" : "Add Food"}
          </h3>

          <form onSubmit={HandleSubmit} className="flex flex-col gap-5">
            {error?.non_field_errors && (
              <div className="rounded-lg bg-[#C08552]/20 border border-[#C08552] p-3">
                {error.non_field_errors.map((msg, i) => (
                  <p key={i} className="text-sm text-[#4B2E2B]">
                    {msg}
                  </p>
                ))}
              </div>
            )}

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="name">
                Food Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                placeholder="Enter food name"
                value={form.name}
                onChange={handleChange}
              />
              {error?.name && (
                <p className="text-[#C08552] text-xs mt-0.5">{error.name[0]}</p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="category">
                Food Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="select w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                required>
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {error?.category && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.category[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="price">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
                max="9999999999"
                step="0.01"
                placeholder="0.00"
              />
              {error?.price && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.price[0]}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="food_img">
                Photo
              </label>
              <input
                type="file"
                id="food_img"
                name="food_img"
                className="file-input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552]
            file:bg-[#C08552] file:text-[#FFF8F0] file:border-0 file:mr-3
            file:hover:bg-[#8C5A3C] file:hover:text-[#FFF8F0] file:transition-colors"
                onChange={handleChange}
              />
              {form.food_img && (
                <p className="text-xs text-[#8C5A3C] mt-0.5">
                  {typeof form.food_img === "string"
                    ? `Current file: ${form.food_img.split("/").pop()}`
                    : `Selected file: ${form.food_img.name}`}
                </p>
              )}
              {error?.food_img && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.food_img[0]}
                </p>
              )}
            </div>

            <div className="modal-action flex justify-end gap-2 mt-1">
              <button
                type="button"
                className="btn bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] hover:bg-[#C08552] hover:text-[#FFF8F0]"
                onClick={() => {
                  document.getElementById(modal_id).close();
                  ClearFields();
                }}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-[#C08552] hover:bg-[#8C5A3C] text-[#FFF8F0] border-none disabled:opacity-50"
                disabled={loading}>
                {loading ? "Saving..." : isEditMode ? "Save Changes" : "Save"}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default FoodFormModal;
