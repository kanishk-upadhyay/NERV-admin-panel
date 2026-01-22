import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllProducts,
  selectProductsByCategory,
} from "../store/selectors";
import Modal from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import { useForm } from "../hooks/useForm";
import { useConfirm } from "../context/ConfirmContext";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/productSlice";
import { useSortableData } from "../hooks/useSortableData";
import { generateNextId } from "../utils/idGenerator";
import { formatCurrency } from "../utils/format";

/**
 * Product Management Page - CRUD interface for products.
 */
const initialValues = {
  name: "",
  category: "",
  price: "",
  stock: "",
  sold: "",
  description: "",
};

const validate = (values) => {
  const newErrors = {};

  if (!values.name.trim()) {
    newErrors.name = "Product name is required";
  } else if (values.name.trim().length < 2) {
    newErrors.name = "Product name must be at least 2 characters";
  }

  if (!values.category.trim()) {
    newErrors.category = "Category is required";
  }

  if (!values.price || parseFloat(values.price) <= 0) {
    newErrors.price = "Price must be greater than 0";
  }

  if (values.stock === "" || parseInt(values.stock, 10) < 0) {
    newErrors.stock = "Stock cannot be negative";
  }

  if (values.sold === "" || parseInt(values.sold, 10) < 0) {
    newErrors.sold = "Sold quantity cannot be negative";
  }

  return newErrors;
};

const Products = () => {
  const products = useSelector(selectAllProducts);
  const productsByCategory = useSelector(selectProductsByCategory); // Used for filter options
  const dispatch = useDispatch();
  const toast = useToast();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const {
    items: sortedProducts,
    requestSort,
    sortConfig,
  } = useSortableData(filteredProducts);

  // Get categories
  const categories = Object.keys(productsByCategory);

  const { values, errors, handleChange, resetForm, isValid, setValues } =
    useForm(initialValues, validate);

  const handleOpenModal = useCallback(
    (product = null) => {
      if (product) {
        setEditingProduct(product);
        setValues({
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          sold: product.sold,
          description: product.description,
        });
      } else {
        setEditingProduct(null);
        resetForm();
      }
      setIsModalOpen(true);
    },
    [resetForm, setValues],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingProduct(null);
    resetForm();
  }, [resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      if (editingProduct) {

        dispatch(
          updateProduct({
            ...editingProduct,
            ...values,
            name: values.name.trim(),
            category: values.category.trim(),
            price: parseFloat(values.price),
            stock: parseInt(values.stock, 10),
            sold: parseInt(values.sold, 10),
          }),
        );
        toast.success(`Updated "${values.name}" successfully!`);
      } else {

        const newProduct = {
          id: generateNextId(products),
          ...values,
          name: values.name.trim(),
          category: values.category.trim(),
          price: parseFloat(values.price),
          stock: parseInt(values.stock, 10),
          sold: parseInt(values.sold, 10),
        };
        dispatch(addProduct(newProduct));
        toast.success(`Added "${newProduct.name}" to inventory!`);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (
      await confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
        "Delete Product",
      )
    ) {
      dispatch(deleteProduct(productId));
      toast.info(`Product "${productName}" deleted.`);
    }
  };



  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-on-surface-variant mt-2">
            Manage inventory, prices, and stock levels
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface border border-outline-variant/20 focus:border-primary outline-none transition-all shadow-sm text-on-surface appearance-none cursor-pointer hover:bg-surface-variant/30 font-medium"
            style={{ backgroundImage: "none" }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
          />
          <button
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-dark hover:shadow-elevation-3 transition-all duration-300 active:scale-95 whitespace-nowrap justify-center shadow-elevation-1"
            onClick={() => handleOpenModal()}
            aria-label="Add new product"
          >
            <span className="text-xl">+</span> Add Product
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface uppercase tracking-wider">
          Inventory Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(productsByCategory).map(([category, items]) => (
            <div
              key={category}
              className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-primary">{category}</h3>
              <p className="text-2xl font-display font-bold text-on-surface mt-1">
                {items.length}{" "}
                <span className="text-sm font-sans font-normal text-on-surface-variant">
                  items
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-elevation-1 border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  ID
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("name")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig?.key === "name" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("category")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortConfig?.key === "category" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("price")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortConfig?.key === "price" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("stock")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Stock
                    {sortConfig?.key === "stock" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("sold")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Sold
                    {sortConfig?.key === "sold" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-on-surface-variant italic"
                  >
                    <span className="text-4xl block mb-2">📦</span>
                    {searchQuery || categoryFilter !== "all"
                      ? "No products match your filters."
                      : "No products found. Add one to get started."}
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-surface-variant/30 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm text-on-surface/70 font-mono">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-on-surface">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tertiary-container text-tertiary-on-container">
                        🏷️ {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${product.stock < 10
                          ? "bg-error-container text-error"
                          : "bg-success-container text-success"
                          }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {product.sold}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-primary">
                      {formatCurrency(product.price * product.sold)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          className="p-2 rounded-full text-tertiary hover:bg-tertiary-container hover:scale-110 transition-all duration-300"
                          onClick={() => handleOpenModal(product)}
                          title="Edit"
                          aria-label={`Edit product ${product.name}`}
                        >
                          ✏️
                        </button>
                        <button
                          className="p-2 rounded-full text-error hover:bg-error-container hover:scale-110 transition-all duration-300"
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Delete product"
                          aria-label={`Delete product ${product.name}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-on-surface"
            >
              Product Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.name ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.name}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-bold text-on-surface"
            >
              Category <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.category ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
              placeholder="e.g., Mecha, Components"
            />
            {errors.category && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.category}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-bold text-on-surface"
              >
                Price ($) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={values.price}
                onChange={handleChange}
                step="0.01"
                className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.price ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="stock"
                className="block text-sm font-bold text-on-surface"
              >
                Stock <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={values.stock}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.stock ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="sold"
                className="block text-sm font-bold text-on-surface"
              >
                Sold <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="sold"
                name="sold"
                value={values.sold}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.sold ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-bold text-on-surface"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 border-transparent focus:bg-surface focus:border-primary transition-all outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button
              type="button"
              className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-full font-bold bg-primary text-on-primary hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="border-white/30 border-t-white" />
                  Processing...
                </>
              ) : editingProduct ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
