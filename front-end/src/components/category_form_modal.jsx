import { useState, useEffect } from "react";
import {
  CreateCategory,
  LoadCategories,
  GetCategory,
  UpdateCategory,
  DeleteCategory,
} from "../services/category_service";

function CategoryFormModal({ modal_id, category_id, setCategories }) {
  const [form, setForm] = useState({ name: "", photo: null });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(category_id);

  useEffect(() => {
    if (!isEditMode) return;

    async function GetCategoryById() {
      try {
        setLoading(true);
        const data = await GetCategory(category_id);
        setForm({ name: data.name ?? "", photo: data.photo ?? null });
      } catch (err) {
        console.error("HandleSubmit error:", err); // <-- add this
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    GetCategoryById();
  }, [isEditMode, category_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm((prev) => ({ ...prev, photo: files[0] }));
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

    if (form.photo && typeof form.photo !== "string") {
      payload.append("photo", form.photo);
    }
    console.log(payload);
    try {
      if (isEditMode) {
        const data = await UpdateCategory(payload, category_id);

        setCategories((prev) =>
          prev.map((category) => (category.id === data.id ? data : category)),
        );
      } else {
        const data = await CreateCategory(payload);
        setCategories((prev) => [...prev, data]);
      }

      ClearFields();
      document.getElementById(modal_id).close();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  function ClearFields() {
    setError({});
  }

  return (
    <>
      <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-lg bg-[#FFF8F0]">
          <h3 className="text-lg font-semibold text-[#4B2E2B] mb-4">
            {isEditMode ? "Edit Category" : "New Category"}
          </h3>

          <form onSubmit={HandleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="name">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552] focus:outline-[#C08552]/20"
                placeholder="Enter category name"
                value={form.name}
                onChange={handleChange}
              />
              {error?.name && (
                <p className="text-[#C08552] text-xs mt-0.5">{error.name}</p>
              )}
            </div>

            <div className="flex flex-col w-full gap-1.5">
              <label
                className="text-sm font-medium text-[#4B2E2B]"
                htmlFor="photo">
                Photo
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                className="file-input w-full bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] focus:border-[#C08552]
            file:bg-[#C08552] file:text-[#FFF8F0] file:border-0 file:mr-3
            file:hover:bg-[#8C5A3C] file:hover:text-[#FFF8F0] file:transition-colors"
                onChange={handleChange}
              />
              {form.photo && (
                <p className="text-xs text-[#8C5A3C] mt-0.5">
                  {typeof form.photo === "string"
                    ? `Current file: ${form.photo.split("/").pop()}`
                    : `Selected file: ${form.photo.name}`}
                </p>
              )}
              {error?.photo && (
                <p className="text-[#C08552] text-xs mt-0.5">
                  {error.photo[0]}
                </p>
              )}
            </div>

            <div className="modal-action flex justify-end gap-2 mt-2">
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

export default CategoryFormModal;
