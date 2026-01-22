import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllUsers } from "../store/selectors";
import {
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from "../store/userSlice";
import { generateNextId } from "../utils/idGenerator";
import Modal from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import { useForm } from "../hooks/useForm";
import { useConfirm } from "../context/ConfirmContext";
import { useSortableData } from "../hooks/useSortableData";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";

const initialValues = {
  name: "",
  email: "",
  role: "",
  status: "active",
};

const validate = (values) => {
  const newErrors = {};
  if (!values.name.trim()) newErrors.name = "Name is required";
  if (!values.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    newErrors.email = "Email is invalid";
  }
  if (!values.role.trim()) newErrors.role = "Role is required";
  return newErrors;
};

/**
 * User Management Page - CRUD interface for users.
 */
const Users = () => {
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();
  const toast = useToast();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort users
  const {
    items: sortedUsers,
    requestSort,
    sortConfig,
  } = useSortableData(filteredUsers);

  const { values, errors, handleChange, resetForm, isValid, setValues } =
    useForm(initialValues, validate);

  const handleOpenModal = useCallback(
    (user = null) => {
      if (user) {
        setEditingUser(user);
        setValues({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      } else {
        setEditingUser(null);
        resetForm();
      }
      setIsModalOpen(true);
    },
    [resetForm, setValues],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingUser(null);
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
      if (editingUser) {
        dispatch(updateUser({ ...editingUser, ...values }));
        toast.success(`User "${values.name}" updated successfully`);
      } else {
        const newUser = {
          id: generateNextId(users),
          ...values,
          joinDate: new Date().toISOString().split("T")[0],
        };
        dispatch(addUser(newUser));
        toast.success(`User "${newUser.name}" created successfully`);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (
      await confirm(
        `Are you sure you want to delete "${userName}"?`,
        "Delete User",
      )
    ) {
      dispatch(deleteUser(userId));
      toast.info(`User "${userName}" deleted.`);
    }
  };

  const handleToggleStatus = (userId) => {
    dispatch(toggleUserStatus(userId));
    toast.success("User status updated");
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-on-surface-variant mt-2">
            Manage system users and access roles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface border border-outline-variant/20 focus:border-primary outline-none transition-all shadow-sm text-on-surface appearance-none cursor-pointer hover:bg-surface-variant/30 font-medium"
            style={{ backgroundImage: "none" }} // Remove default arrow if needed, or keep it
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />
          <button
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-dark hover:shadow-elevation-3 transition-all duration-300 active:scale-95 whitespace-nowrap justify-center shadow-elevation-1"
            onClick={() => handleOpenModal()}
            aria-label="Add new user"
          >
            <span className="text-xl">+</span> Add User
          </button>
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
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none group"
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
                  onClick={() => requestSort("email")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Email
                    {sortConfig?.key === "email" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("role")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Role
                    {sortConfig?.key === "role" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("status")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortConfig?.key === "status" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("joinDate")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Join Date
                    {sortConfig?.key === "joinDate" && (
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-on-surface-variant italic"
                  >
                    <span className="text-4xl block mb-2">📭</span>
                    {searchQuery || statusFilter !== "all"
                      ? "No users match your filters."
                      : "No users found. Add one to get started."}
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-variant/30 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm text-on-surface/70 font-mono">
                      {user.id}
                    </td>
                    <td className="px-6 py-5 font-medium text-on-surface">
                      {user.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {user.email}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-primary">
                      {user.role}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${user.status === "active"
                            ? "bg-success-container text-success group-hover:bg-success group-hover:text-white"
                            : "bg-error-container text-error"
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${user.status === "active" ? "bg-success animate-pulse" : "bg-error"}`}
                        ></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <button
                          className="p-2 rounded-full text-tertiary hover:bg-tertiary-container hover:scale-110 transition-all duration-300"
                          onClick={() => handleOpenModal(user)}
                          title="Edit"
                          aria-label={`Edit user ${user.name}`}
                        >
                          ✏️
                        </button>
                        <button
                          className="p-2 rounded-full text-secondary hover:bg-secondary-container hover:scale-110 transition-all duration-300"
                          onClick={() => handleToggleStatus(user.id)}
                          title="Toggle Status"
                          aria-label={`Toggle status for ${user.name}`}
                        >
                          🔄
                        </button>
                        <button
                          className="p-2 rounded-full text-error hover:bg-error-container hover:scale-110 transition-all duration-300"
                          onClick={() => handleDelete(user.id, user.name)}
                          title="Delete user"
                          aria-label={`Delete user ${user.name}`}
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
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-on-surface"
            >
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter full name"
              autoComplete="name"
              className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.name ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
            />
            {errors.name && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.name}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-on-surface"
            >
              Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="user@example.com"
              autoComplete="email"
              className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.email ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
            />
            {errors.email && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.email}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-bold text-on-surface"
            >
              Role <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              placeholder="e.g., Pilot, Commander"
              autoComplete="organization-title"
              className={`w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 focus:bg-surface transition-all outline-none ${errors.role ? "border-error focus:border-error" : "border-transparent focus:border-primary"}`}
            />
            {errors.role && (
              <span className="text-xs text-error font-medium flex items-center gap-1">
                ⚠️ {errors.role}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-bold text-on-surface"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface-variant/30 border-2 border-transparent focus:bg-surface focus:border-primary transition-all outline-none appearance-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                  Saving...
                </>
              ) : editingUser ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
