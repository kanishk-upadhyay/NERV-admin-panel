import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllProducts,
  selectProductsByCategory,
  selectTheme,
} from "../store/selectors";
import PageHeader from "../components/common/PageHeader";
import TableContainer from "../components/common/TableContainer";
import ActionPill from "../components/common/ActionPill";
import StatusBadge from "../components/common/StatusBadge";
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
  const theme = useSelector(selectTheme);
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
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Unified Page Header */}
      <PageHeader
        title="Product Management"
        magiTitle="ORDNANCE & ASSET INVENTORY"
        description="Manage equipment catalog, stock levels, and procurement pricing"
      >
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface border border-outline-variant/30 focus:border-primary outline-none transition-all text-xs font-mono text-on-surface appearance-none cursor-pointer hover:bg-surface-variant/30"
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
          placeholder="Search products or category..."
        />

        <button
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl font-mono text-xs font-bold hover:brightness-110 transition-all active:scale-95 whitespace-nowrap justify-center shadow-xs cursor-pointer"
          onClick={() => handleOpenModal()}
          aria-label="Add new product"
        >
          <span>+</span>
          <span>Add Product</span>
        </button>
      </PageHeader>

      {/* Inventory Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-on-surface-variant font-mono">
          Inventory Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(productsByCategory).map(([category, items]) => (
            <div
              key={category}
              className={`p-4 transition-all ${
                theme === "magi"
                  ? "bg-surface border border-primary/40 magi-hex-card font-mono"
                  : "bg-surface rounded-2xl border border-outline-variant/20 shadow-xs hover:shadow-sm"
              }`}
            >
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary font-mono">{category}</h3>
              <p className="text-2xl font-mono font-bold text-on-surface mt-1">
                {items.length}{" "}
                <span className="text-xs font-mono font-normal text-on-surface-variant">
                  units
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Table with Unified Container & Primitives */}
      <TableContainer>
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-primary/5 border-b border-outline-variant/20">
            <tr>
              <th scope="col" className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary">
                ID
              </th>
              <th
                scope="col"
                onClick={() => requestSort("name")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortConfig?.key === "name" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("category")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Category
                  {sortConfig?.key === "category" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("price")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Price
                  {sortConfig?.key === "price" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("stock")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Stock
                  {sortConfig?.key === "stock" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("sold")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Sold
                  {sortConfig?.key === "sold" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary">
                Revenue
              </th>
              <th scope="col" className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant italic font-mono">
                  <span className="text-4xl block mb-2">📦</span>
                  {searchQuery || categoryFilter !== "all"
                    ? "No products match your filters."
                    : "No products found in armory."}
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="px-4 py-4 font-mono text-on-surface-variant text-xs">
                    #{product.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-on-surface">
                    {product.name}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/30">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-on-surface">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={product.stock < 5 ? "error" : "active"}
                      label={`${product.stock} units`}
                    />
                  </td>
                  <td className="px-4 py-4 font-mono text-on-surface-variant text-xs">
                    {product.sold}
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-primary">
                    {formatCurrency(product.price * product.sold)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionPill
                        variant="edit"
                        onClick={() => handleOpenModal(product)}
                        title="Edit Product"
                      >
                        Edit
                      </ActionPill>
                      <ActionPill
                        variant="delete"
                        onClick={() => handleDelete(product.id, product.name)}
                        title="Delete Product"
                      >
                        Delete
                      </ActionPill>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableContainer>

      {/* Edit/Add Product Modal Form with Crisp Dark Theme & High Contrast */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Ordnance Record" : "Register New Ordnance Asset"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5 font-mono text-xs">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block font-bold text-on-surface uppercase tracking-wider"
            >
              Product / Asset Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg bg-surface-container border text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm ${
                errors.name ? "border-error focus:border-error" : "border-outline-variant/40"
              }`}
              placeholder="e.g. Progressive Knife PK-01"
            />
            {errors.name && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.name}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="category"
              className="block font-bold text-on-surface uppercase tracking-wider"
            >
              Category Classification <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg bg-surface-container border text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm ${
                errors.category ? "border-error focus:border-error" : "border-outline-variant/40"
              }`}
              placeholder="e.g. Mecha, Weapons, Equipment"
            />
            {errors.category && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.category}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="price"
                className="block font-bold text-on-surface uppercase tracking-wider"
              >
                Unit Price ($) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={values.price}
                onChange={handleChange}
                step="0.01"
                className={`w-full px-4 py-2.5 rounded-lg bg-surface-container border text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm ${
                  errors.price ? "border-error focus:border-error" : "border-outline-variant/40"
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <span className="text-xs text-error font-medium">⚠️ {errors.price}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="stock"
                className="block font-bold text-on-surface uppercase tracking-wider"
              >
                In-Stock Units <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={values.stock}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-surface-container border text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm ${
                  errors.stock ? "border-error focus:border-error" : "border-outline-variant/40"
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <span className="text-xs text-error font-medium">⚠️ {errors.stock}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="sold"
                className="block font-bold text-on-surface uppercase tracking-wider"
              >
                Dispatched / Sold <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="sold"
                name="sold"
                value={values.sold}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-surface-container border text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm ${
                  errors.sold ? "border-error focus:border-error" : "border-outline-variant/40"
                }`}
                placeholder="0"
              />
              {errors.sold && (
                <span className="text-xs text-error font-medium">⚠️ {errors.sold}</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block font-bold text-on-surface uppercase tracking-wider"
            >
              Technical Description / Spec
            </label>
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows="3"
              placeholder="Operational technical specifications..."
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none font-mono text-base sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              className="px-4 py-2 rounded-lg font-mono text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 transition-colors border border-outline-variant/30 cursor-pointer"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg font-mono text-xs font-bold bg-primary text-on-primary hover:brightness-110 shadow-xs transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="border-white/30 border-t-white" />
                  Processing...
                </>
              ) : editingProduct ? (
                "Update Asset Record"
              ) : (
                "Register Asset"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
