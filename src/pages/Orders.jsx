import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllOrders } from "../store/selectors";
import { updateOrderStatus, deleteOrder } from "../store/orderSlice";
import { useConfirm } from "../context/ConfirmContext";
import { useToast } from "../hooks/useToast";
import { useSortableData } from "../hooks/useSortableData";
import SearchBar from "../components/common/SearchBar";
import { formatCurrency } from "../utils/format";

/**
 * Order Management Page - manages customer orders.
 */
const Orders = () => {
  const orders = useSelector(selectAllOrders);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const toast = useToast();

  /* [NEW] Status Filter State */
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    toast.success(`Order #${orderId} marked as ${newStatus}`);
  };

  const handleDelete = async (orderId) => {
    if (
      await confirm(
        `Are you sure you want to delete Order #${orderId}?`,
        "Delete Order",
      )
    ) {
      dispatch(deleteOrder(orderId));
      toast.info(`Order #${orderId} deleted.`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success-container text-success group-hover:bg-success group-hover:text-white";
      case "Shipped":
        return "bg-secondary-container text-secondary group-hover:bg-secondary group-hover:text-white";
      case "Pending":
        return "bg-tertiary-container text-tertiary group-hover:bg-tertiary group-hover:text-white";
      default:
        return "bg-surface-variant text-on-surface-variant";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success";
      case "Shipped":
        return "bg-secondary";
      case "Pending":
        return "bg-tertiary";
      default:
        return "bg-on-surface-variant";
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-on-surface-variant mt-2">
            Track and update customer orders
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* [NEW] Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface border border-outline-variant/20 focus:border-primary outline-none transition-all shadow-sm text-on-surface appearance-none cursor-pointer hover:bg-surface-variant/30 font-medium"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders..."
          />
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-elevation-1 border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5">
              <tr>
                <th
                  scope="col"
                  onClick={() => requestSort("id")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Order ID
                    {sortConfig?.key === "id" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("customerName")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Customer
                    {sortConfig?.key === "customerName" && (
                      <span>
                        {sortConfig.direction === "ascending" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("date")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortConfig?.key === "date" && (
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
                  Items
                </th>
                <th
                  scope="col"
                  onClick={() => requestSort("total")}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary cursor-pointer hover:bg-primary/10 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    Total
                    {sortConfig?.key === "total" && (
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
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-on-surface-variant italic"
                  >
                    <span className="text-4xl block mb-2">📦</span>
                    {searchQuery || statusFilter !== "all"
                      ? "No orders match your filters."
                      : "No orders found."}
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-variant/30 transition-colors group"
                  >
                    <td className="px-6 py-5 text-sm text-on-surface/70 font-mono">
                      #{order.id}
                    </td>
                    <td className="px-6 py-5 font-medium text-on-surface">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {order.date}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-5 text-sm font-mono font-bold text-primary">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${getStatusColor(order.status)}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 animate-pulse ${getStatusDot(order.status)}`}
                        ></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="px-3 py-1 text-sm bg-surface-container-high border border-outline-variant/20 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 text-on-surface cursor-pointer hover:bg-surface-variant/50 transition-colors"
                          aria-label={`Change status for order ${order.id}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <button
                          className="p-2 rounded-full text-error hover:bg-error-container hover:scale-110 transition-all duration-300"
                          onClick={() => handleDelete(order.id)}
                          title="Delete Order"
                          aria-label={`Delete order ${order.id}`}
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
    </div>
  );
};

export default Orders;
