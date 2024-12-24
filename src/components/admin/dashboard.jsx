import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Package, CheckCircle, XCircle } from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';

// Key Metrics Component
const KeyMetric = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-b-4 border-pink-500">
    <div className="flex justify-between items-center mb-4">
      <div className="bg-pink-50 p-3 rounded-full">{icon}</div>
      <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
    <p className="text-2xl font-bold text-pink-600">{value}</p>
  </div>
);

// Chart Component
const ChartCard = ({ title, data, percentage, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-pink-500">
    <h2 className="text-lg font-semibold text-pink-700 mb-4">{title}</h2>
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="text-center mt-4">
      <p className="text-3xl font-bold text-pink-600">{percentage}%</p>
      <p className="text-pink-500">{description}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const fetchOrderData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://ecommercebackend-8gx8.onrender.com/get-orders");
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrdersData(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [refresh]);

  const totalOrders = ordersData.length;
  const deliveredOrders = ordersData.filter(order => order.status === 'Delivered').length;
  const completionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
  const totalRevenue = ordersData.reduce((sum, order) => sum + (order.price || 0), 0);
  const profitMargin = 65;

  const orderData = [
    { name: 'Completed', value: deliveredOrders, color: '#FF8042' },
    { name: 'Pending', value: totalOrders - deliveredOrders, color: '#FFBB28' }
  ];

  const revenueData = [
    { name: 'Profit', value: profitMargin, color: '#FF8042' },
    { name: 'Cost', value: 100 - profitMargin, color: '#FFBB28' }
  ];

  const growthData = [
    { name: 'Growth', value: 82, color: '#FF8042' },
    { name: 'Target', value: 18, color: '#FFBB28' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
          <XCircle className="mx-auto h-16 w-16 text-pink-500 mb-4" />
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchOrderData} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-100 p-6 lg:p-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-pink-800">Dashboard</h1>
            <p className="text-pink-600">Welcome back to Mera Bestie Admin!</p>
          </div>
          <button 
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition flex items-center" 
            onClick={() => setRefresh(!refresh)}
          >
            <TrendingUp className="mr-2 h-5 w-5" /> Refresh Data
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KeyMetric icon={<ShoppingCart className="text-pink-500" />} title="Total Orders" value={totalOrders} change={12} />
          <KeyMetric icon={<CheckCircle className="text-pink-500" />} title="Orders Delivered" value={deliveredOrders} change={100} />
          <KeyMetric icon={<FaRupeeSign className="text-pink-500" />} title="Revenue Generated" value={`₹${totalRevenue.toLocaleString()}`} change={15} />
          <KeyMetric icon={<Package className="text-pink-500" />} title="Total Products" value={89} change={5} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ChartCard title="Order Status" data={orderData} percentage={completionRate} description="Completion Rate" />
          <ChartCard title="Revenue Analytics" data={revenueData} percentage={profitMargin} description="Profit Margin" />
          <ChartCard title="Customer Growth" data={growthData} percentage={82} description="Growth Rate" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
