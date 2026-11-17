import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  selectTheme,
  selectSimulatedLatency,
  selectSimulateFailure,
} from "../store/selectors";
import {
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  bulkUpdateUserStatus,
} from "../store/userSlice";
import { generateNextId } from "../utils/idGenerator";
import PageHeader from "../components/common/PageHeader";
import TableContainer from "../components/common/TableContainer";
import StatusBadge from "../components/common/StatusBadge";
import ActionPill from "../components/common/ActionPill";
import Modal from "../components/common/Modal";
import { useToast } from "../hooks/useToast";
import { useForm } from "../hooks/useForm";
import { useConfirm } from "../context/ConfirmContext";
import { useSortableData } from "../hooks/useSortableData";
import SearchBar from "../components/common/SearchBar";
import Spinner from "../components/common/Spinner";
import { exportToCsv } from "../utils/exportCsv";

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
 * User Management Page - Personnel management with bulk operations,
 * CSV export, and optimistic rollbacks under simulated network latency.
 */
const Users = () => {
  const users = useSelector(selectAllUsers);
  const theme = useSelector(selectTheme);
  const simulatedLatency = useSelector(selectSimulatedLatency);
  const simulateFailure = useSelector(selectSimulateFailure);

  const dispatch = useDispatch();
  const toast = useToast();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);

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

  // Selection Logic
  const allSelected =
    sortedUsers.length > 0 && selectedIds.length === sortedUsers.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedUsers.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
    if (simulatedLatency) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

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
        toast.success(`User "${values.name}" created successfully`);
      }
      handleCloseModal();
    } catch {
      toast.error("Failed to save user");
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
      setSelectedIds((prev) => prev.filter((id) => id !== userId));
      toast.info(`User "${userName}" deleted.`);
    }
  };

  // Optimistic Toggle with Rollback support
  const handleToggleStatus = async (userId) => {
    const user = users.find((u) => u.id === userId);
    const prevStatus = user?.status;

    // Optimistic dispatch
    dispatch(toggleUserStatus(userId));

    if (simulatedLatency) {
      setPendingIds((prev) => [...prev, userId]);
      await new Promise((r) => setTimeout(r, 400));
      setPendingIds((prev) => prev.filter((id) => id !== userId));

      if (simulateFailure) {
        dispatch(toggleUserStatus(userId)); // revert
        toast.error(`MAGI REJECTION // Personnel status sync failed. Reverted to ${prevStatus}.`);
        return;
      }
    }

    toast.success(`Personnel #${userId} status updated.`);
  };

  // Bulk Deactivate / Activate
  const handleBulkSetStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    const targetIds = [...selectedIds];
    const prevStatusMap = {};
    targetIds.forEach((id) => {
      const u = users.find((x) => x.id === id);
      if (u) prevStatusMap[id] = u.status;
    });

    dispatch(bulkUpdateUserStatus({ ids: targetIds, status: newStatus }));
    setSelectedIds([]);

    if (simulatedLatency) {
      setPendingIds((prev) => [...prev, ...targetIds]);
      await new Promise((r) => setTimeout(r, 400));
      setPendingIds((prev) => prev.filter((id) => !targetIds.includes(id)));

      if (simulateFailure) {
        targetIds.forEach((id) => {
          dispatch(updateUser({ ...users.find((u) => u.id === id), status: prevStatusMap[id] }));
        });
        toast.error("MAGI TIMEOUT // Bulk status update failed. Rollback executed.");
        return;
      }
    }

    toast.success(`Bulk Action: ${targetIds.length} personnel marked as ${newStatus}.`);
  };

  // Export Filtered View to CSV
  const handleExportCsv = () => {
    const headers = ["Personnel ID", "Full Name", "Email Address", "Clearance Role", "Status", "Enlistment Date"];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.role,
      u.status,
      u.joinDate,
    ]);

    const dateStr = new Date().toISOString().split("T")[0];
    exportToCsv(`nerv_personnel_manifest_${dateStr}.csv`, headers, rows);
    toast.success(`Exported ${filteredUsers.length} personnel records to CSV.`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Unified Page Header */}
      <PageHeader
        title="User Management"
        magiTitle="PERSONNEL DIRECTORY"
        description="Manage authorized staff, clearance tiers, and status protocols"
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface border border-outline-variant/30 focus:border-primary outline-none transition-all text-xs font-mono text-on-surface appearance-none cursor-pointer hover:bg-surface-variant/30"
        >
          <option value="all">All Personnel</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive / Suspended</option>
        </select>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search personnel name, email..."
        />

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface hover:bg-surface-variant text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all text-on-surface cursor-pointer"
          title="Download CSV manifest of filtered personnel"
        >
          <span>📥</span>
          <span>Export CSV</span>
        </button>

        <button
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary rounded-xl font-mono text-xs font-bold hover:brightness-110 transition-all active:scale-95 whitespace-nowrap justify-center shadow-xs cursor-pointer"
          onClick={() => handleOpenModal()}
          aria-label="Add new user"
        >
          <span>+</span>
          <span>Add Personnel</span>
        </button>
      </PageHeader>

      {/* Bulk Action Pill Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>[{selectedIds.length} PERSONNEL SELECTED]</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkSetStatus("inactive")}
              className="px-3 py-1.5 rounded-lg bg-error text-on-error font-bold hover:brightness-110 transition-all flex items-center gap-1"
            >
              <span>⛔</span>
              <span>Bulk Deactivate</span>
            </button>
            <button
              onClick={() => handleBulkSetStatus("active")}
              className="px-3 py-1.5 rounded-lg bg-success text-on-success font-bold hover:brightness-110 transition-all flex items-center gap-1"
            >
              <span>✓</span>
              <span>Bulk Activate</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant/50 text-on-surface hover:bg-surface-variant transition-all flex items-center gap-1"
            >
              <span>📥</span>
              <span>Export Selected CSV</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface underline"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Personnel Table with Unified Container Primitives */}
      <TableContainer>
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-primary/5 border-b border-outline-variant/20">
            <tr>
              <th className="px-4 py-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all users"
                  className="w-4 h-4 rounded border-outline-variant/40 accent-primary cursor-pointer"
                />
              </th>
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
                onClick={() => requestSort("email")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Email
                  {sortConfig?.key === "email" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("role")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Role / Clearance
                  {sortConfig?.key === "role" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("status")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig?.key === "status" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("joinDate")}
                className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
              >
                <div className="flex items-center gap-1">
                  Join Date
                  {sortConfig?.key === "joinDate" && (
                    <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant italic font-mono">
                  <span className="text-4xl block mb-2">📭</span>
                  {searchQuery || statusFilter !== "all"
                    ? "No personnel match current query filters."
                    : "No personnel records found."}
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => {
                const isChecked = selectedIds.includes(user.id);
                const isPending = pendingIds.includes(user.id);

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isChecked
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "hover:bg-surface-variant/20"
                    } ${isPending ? "opacity-60 animate-pulse" : ""}`}
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectOne(user.id)}
                        aria-label={`Select personnel #${user.id}`}
                        className="w-4 h-4 rounded border-outline-variant/40 accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 text-xs text-on-surface/70 font-mono">
                      #{user.id}
                    </td>
                    <td className="px-4 py-4 font-medium text-on-surface">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-on-surface-variant">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-xs font-mono font-bold text-primary">
                      {user.role}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        status={user.status}
                        pulse={user.status === "active"}
                      />
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-on-surface-variant">
                      {user.joinDate}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionPill
                          variant="default"
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={isPending}
                          title="Toggle Active Status"
                        >
                          Toggle
                        </ActionPill>
                        <ActionPill
                          variant="edit"
                          onClick={() => handleOpenModal(user)}
                          title="Edit"
                        >
                          Edit
                        </ActionPill>
                        <ActionPill
                          variant="delete"
                          onClick={() => handleDelete(user.id, user.name)}
                          title="Delete"
                        >
                          Delete
                        </ActionPill>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableContainer>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit Personnel Record" : "Add Personnel to Database"}
      >
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5 font-mono text-xs">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block font-bold text-on-surface uppercase tracking-wider">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Shinji Ikari"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm"
            />
            {errors.name && <span className="text-error font-medium">⚠️ {errors.name}</span>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block font-bold text-on-surface uppercase tracking-wider">
              Communication Relay (Email) <span className="text-error">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="shinji@nerv.hq"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm"
            />
            {errors.email && <span className="text-error font-medium">⚠️ {errors.email}</span>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role" className="block font-bold text-on-surface uppercase tracking-wider">
              Operational Role <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              placeholder="e.g. EVA-01 Pilot / Commander"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm"
            />
            {errors.role && <span className="text-error font-medium">⚠️ {errors.role}</span>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="block font-bold text-on-surface uppercase tracking-wider">
              Clearance Status
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm cursor-pointer"
            >
              <option value="active" className="bg-surface text-on-surface">Active Duty</option>
              <option value="inactive" className="bg-surface text-on-surface">Suspended / Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:brightness-110 flex items-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" />}
              {editingUser ? "Save Changes" : "Register Personnel"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
