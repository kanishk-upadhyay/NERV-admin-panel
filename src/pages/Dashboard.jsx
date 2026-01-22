import { useSelector } from "react-redux";
import {
  selectTotalUsers,
  selectActiveUsers,
  selectTotalProducts,
  selectOrderRevenue,
  selectTotalOrders,
  selectCategoryCount,
  selectAverageProductPrice,
} from "../store/selectors";

import StatCard from "../components/common/StatCard";
import { formatCurrency } from "../utils/format";

/**
 * Dashboard Page - Displays key metrics and statistics.
 */
const Dashboard = () => {
  const totalUsers = useSelector(selectTotalUsers);
  const activeUsers = useSelector(selectActiveUsers);
  const totalProducts = useSelector(selectTotalProducts);
  const totalRevenue = useSelector(selectOrderRevenue);
  const totalOrders = useSelector(selectTotalOrders);
  const categoryCount = useSelector(selectCategoryCount);
  const avgPrice = useSelector(selectAverageProductPrice);

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-extrabold text-on-surface tracking-tight">
          Dashboard
        </h1>
        <p className="text-on-surface-variant text-lg">
          Overview of your application performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          icon="👥"
          title="Total Users"
          value={totalUsers}
          colorClass="bg-primary"
        />
        <StatCard
          icon="✅"
          title="Active Users"
          value={activeUsers}
          colorClass="bg-success"
        />
        <StatCard
          icon="📦"
          title="Total Products"
          value={totalProducts}
          colorClass="bg-secondary"
        />
        <StatCard
          icon="🛒"
          title="Total Orders"
          value={totalOrders}
          colorClass="bg-tertiary"
        />
        <StatCard
          icon="💰"
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          colorClass="bg-success-container text-on-success-container"
        />
        <StatCard
          icon="🏷️"
          title="Product Categories"
          value={categoryCount}
          colorClass="bg-primary-light"
        />
        <StatCard
          icon="📊"
          title="Avg Product Price"
          value={formatCurrency(avgPrice)}
          colorClass="bg-secondary-light"
        />
        <StatCard
          icon="📈"
          title="User Activity Rate"
          value={`${totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%`}
          colorClass="bg-tertiary-light"
        />
      </div>
    </div>
  );
};

export default Dashboard;
