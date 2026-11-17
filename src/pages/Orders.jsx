import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllOrders,
  selectTheme,
  selectSimulatedLatency,
  selectSimulateFailure,
} from "../store/selectors";
import {
  updateOrderStatus,
  deleteOrder,
  bulkUpdateOrderStatus,
} from "../store/orderSlice";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../hooks/useToast";
import { useSortableData } from "../hooks/useSortableData";
import PageHeader from "../components/common/PageHeader";
import TableContainer from "../components/common/TableContainer";
import ActionPill from "../components/common/ActionPill";
import { getStatusConfig } from "../components/common/StatusBadge";
import SearchBar from "../components/common/SearchBar";
import { formatCurrency } from "../utils/format";
import { exportToCsv } from "../utils/exportCsv";

/**
 * Order Management Page - Manages customer orders with bulk operations,
 * CSV export, and optimistic rollbacks under simulated network latency.
 */
const Orders = () => {
  const orders = useSelector(selectAllOrders);
  const theme = useSelector(selectTheme);
  const simulatedLatency = useSelector(selectSimulatedLatency);
  const simulateFailure = useSelector(selectSimulateFailure);

  const dispatch = useDispatch();
  const confirm = useConfirm();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const {
    items: sortedOrders,
    requestSort,
    sortConfig,
  } = useSortableData(filteredOrders);

  // Selection Logic
  const allSelected =
    sortedOrders.length > 0 && selectedIds.length === sortedOrders.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Optimistic Async Mutation Execution
  const handleStatusChange = async (orderId, newStatus) => {
    const currentOrder = orders.find((o) => o.id === orderId);
    const previousStatus = currentOrder?.status;

    // 1. Optimistic Update in UI
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));

    if (simulatedLatency) {
      setPendingIds((prev) => [...prev, orderId]);
      await new Promise((r) => setTimeout(r, 400));
      setPendingIds((prev) => prev.filter((id) => id !== orderId));

      // Check simulated failure rollback
      if (simulateFailure) {
        dispatch(updateOrderStatus({ id: orderId, status: previousStatus }));
        toast.error(
          `MAGI REJECTION // Order #${orderId} update failed. Rollback executed.`
        );
        return;
      }
    }

    toast.success(`Order #${orderId} marked as ${newStatus}`);
  };

  // Bulk Operations
  const handleBulkMarkFulfilled = async () => {
    if (selectedIds.length === 0) return;
    const targetIds = [...selectedIds];
    const previousMap = {};
    targetIds.forEach((id) => {
      const ord = orders.find((o) => o.id === id);
      if (ord) previousMap[id] = ord.status;
    });

    // Optimistic dispatch
    dispatch(bulkUpdateOrderStatus({ ids: targetIds, status: "Delivered" }));
    setSelectedIds([]);

    if (simulatedLatency) {
      setPendingIds((prev) => [...prev, ...targetIds]);
      await new Promise((r) => setTimeout(r, 400));
      setPendingIds((prev) => prev.filter((id) => !targetIds.includes(id)));

      if (simulateFailure) {
        // Rollback
        targetIds.forEach((id) => {
          dispatch(updateOrderStatus({ id, status: previousMap[id] }));
        });
        toast.error(`MAGI TIMEOUT // Bulk fulfillment failed. All statuses rolled back.`);
        return;
      }
    }

    toast.success(`Bulk Operation: ${targetIds.length} orders marked as Delivered.`);
  };

  const handleBulkMarkShipped = async () => {
    if (selectedIds.length === 0) return;
    const targetIds = [...selectedIds];
    dispatch(bulkUpdateOrderStatus({ ids: targetIds, status: "Shipped" }));
    setSelectedIds([]);

    if (simulatedLatency) {
      setPendingIds((prev) => [...prev, ...targetIds]);
      await new Promise((r) => setTimeout(r, 400));
      setPendingIds((prev) => prev.filter((id) => !targetIds.includes(id)));
    }

    toast.success(`Bulk Operation: ${targetIds.length} orders marked as Shipped.`);
  };

  // Export Filtered View to CSV
  const handleExportCsv = () => {
    const headers = ["Order ID", "Customer Name", "Order Date", "Item Count", "Total Revenue", "Fulfillment Status"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.customerName,
      o.date,
      o.items?.length || 1,
      formatCurrency(o.total),
      o.status,
    ]);

    const dateStr = new Date().toISOString().split("T")[0];
    exportToCsv(`nerv_orders_manifest_${dateStr}.csv`, headers, rows);
    toast.success(`Exported ${filteredOrders.length} orders to CSV manifest.`);
  };

  const handleDelete = async (orderId) => {
    if (
      await confirm(
        `Are you sure you want to delete Order #${orderId}?`,
        "Delete Order",
      )
    ) {
      dispatch(deleteOrder(orderId));
      setSelectedIds((prev) => prev.filter((id) => id !== orderId));
      toast.info(`Order #${orderId} deleted.`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Unified Page Header */}
      <PageHeader
        title="Order Management"
        magiTitle="LOGISTICS & REQUISITIONS"
        description="Track and fulfill customer supply manifests"
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface border border-outline-variant/30 focus:border-primary outline-none transition-all text-xs font-mono text-on-surface appearance-none cursor-pointer hover:bg-surface-variant/30"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search order ID or customer..."
        />

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface hover:bg-surface-variant text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all text-on-surface cursor-pointer"
          title="Download CSV manifest of currently filtered orders"
        >
          <span>📥</span>
          <span>Export CSV</span>
        </button>
      </PageHeader>

      {/* Bulk Action Pill Bar (Revealed when rows are checked) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>[{selectedIds.length} ORDERS SELECTED]</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkMarkFulfilled}
              className="px-3 py-1.5 rounded-lg bg-success text-on-success font-bold hover:brightness-110 transition-all flex items-center gap-1"
            >
              <span>✓</span>
              <span>Bulk Mark Fulfilled</span>
            </button>
            <button
              onClick={handleBulkMarkShipped}
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-500 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>🚀</span>
              <span>Bulk Mark Shipped</span>
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

      {/* Orders Table with Unified Container Primitives */}
      <TableContainer>
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-primary/5 border-b border-outline-variant/20">
              <tr>
                <th className="px-4 py-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all orders"
                    className="w-4 h-4 rounded border-outline-variant/40 accent-primary cursor-pointer"
                  />
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("id")}
                  className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Order ID
                    {sortConfig?.key === "id" && (
                      <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("customerName")}
                  className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Customer
                    {sortConfig?.key === "customerName" && (
                      <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("date")}
                  className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig?.key === "date" && (
                      <span>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary">
                  Items
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("total")}
                  className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Total
                    {sortConfig?.key === "total" && (
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
                <th scope="col" className="px-4 py-4 font-mono font-bold uppercase tracking-wider text-primary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant italic font-mono">
                    <span className="text-4xl block mb-2">📦</span>
                    {searchQuery || statusFilter !== "all"
                      ? "No orders match current query parameters."
                      : "No orders found in database."}
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => {
                  const isChecked = selectedIds.includes(order.id);
                  const isPending = pendingIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
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
                          onChange={() => toggleSelectOne(order.id)}
                          aria-label={`Select order #${order.id}`}
                          className="w-4 h-4 rounded border-outline-variant/40 accent-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-on-surface">
                        #{order.id}
                      </td>
                      <td className="px-4 py-4 font-medium text-on-surface">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-4 font-mono text-on-surface-variant text-xs">
                        {order.date}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-on-surface-variant">
                        {order.items ? `${order.items.length} units` : "1 unit"}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-on-surface">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-4">
                        {(() => {
                          const { colorClasses, dotColor } = getStatusConfig(order.status);
                          return (
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={isPending}
                                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold cursor-pointer border ${colorClasses}`}
                              >
                                <option value="Pending" className="bg-surface text-on-surface">Pending</option>
                                <option value="Shipped" className="bg-surface text-on-surface">Shipped</option>
                                <option value="Delivered" className="bg-surface text-on-surface">Delivered</option>
                              </select>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <ActionPill
                          variant="delete"
                          onClick={() => handleDelete(order.id)}
                          title="Delete Order"
                        >
                          Delete
                        </ActionPill>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
      </TableContainer>
    </div>
  );
};

export default Orders;
