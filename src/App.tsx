import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  History, 
  Settings, 
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Zap,
  Terminal
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [orderLink, setOrderLink] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(150);
  const [selectedService, setSelectedService] = useState('654'); // Default to Twitch
  const [orderStatus, setOrderStatus] = useState('');

  const services = [
    { id: '654', name: 'Twitch Viewers', price: '2.99' },
    { id: '592', name: 'Kick Viewers', price: '2.99' },
    { id: '604', name: 'TikTok Live Viewers', price: '3.99' },
    { id: '819', name: 'YouTube Live Viewers', price: '4.99' },
    { id: '645', name: 'Facebook Live Viewers', price: '2.99' },
    { id: '633', name: 'Twitch Followers', price: '2.50' },
    { id: '576', name: 'TikTok Followers', price: '3.99' }
  ];

  useEffect(() => {
    if (apiToken) {
      fetchBalance();
    }
  }, [apiToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://supribots.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: username,
          password: password
        })
      });

      if (response.ok) {
        const data = await response.json();
        setApiToken(data.api_token);
        setIsAuthenticated(true);
      } else {
        setOrderStatus('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setOrderStatus('Connection error. Please try again.');
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await fetch('https://supribots.com/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          key: apiToken,
          action: 'balance'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://supribots.com/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          key: apiToken,
          action: 'add',
          service: selectedService,
          link: orderLink,
          quantity: orderQuantity.toString()
        })
      });

      if (response.ok) {
        setOrderStatus('Order placed successfully! Please wait...');
        setOrderLink('');
      } else {
        setOrderStatus('Order failed. Please try again.');
      }
    } catch (error) {
      setOrderStatus('Connection error. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-green-500 animate-pulse-border">
            <div className="flex items-center justify-center mb-8">
              <Terminal className="w-12 h-12 text-green-500" />
              <h1 className="text-3xl font-bold text-green-500 ml-3 font-mono">SUPRIBOTS</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900 border border-green-500 text-green-500 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-green-500 text-green-500 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-gray-900 py-2 rounded font-bold hover:bg-green-400 transition-colors duration-200 font-mono"
              >
                LOGIN
              </button>
            </form>
            {orderStatus && (
              <p className="mt-4 text-red-500 text-center font-mono">{orderStatus}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-green-500">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-green-500 font-mono flex items-center">
            <Terminal className="mr-2" />
            SUPRIBOTS
          </h1>
        </div>
        <nav className="mt-6">
          {[
            { name: 'Dashboard', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
            { name: 'Orders', icon: <ShoppingCart size={20} />, id: 'orders' },
            { name: 'Customers', icon: <Users size={20} />, id: 'customers' },
            { name: 'History', icon: <History size={20} />, id: 'history' },
            { name: 'Settings', icon: <Settings size={20} />, id: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-green-500 font-mono ${
                activeTab === item.id ? 'bg-gray-700 text-green-500 border-l-4 border-green-500' : ''
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <button className="w-full flex items-center px-4 py-2 text-gray-400 hover:text-red-500 font-mono">
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-gray-800 border-b border-green-500">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center bg-gray-900 rounded-lg px-4 py-2 w-64 border border-green-500">
              <Search size={20} className="text-green-500" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent outline-none w-full text-green-500 font-mono"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-green-500 font-mono">Balance: ${balance}</div>
              <button className="relative p-2 hover:bg-gray-700 rounded-full">
                <Bell size={20} className="text-green-500" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* New Order Form */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8 border border-green-500">
            <h2 className="text-xl font-bold text-green-500 mb-6 font-mono">New Order</h2>
            <form onSubmit={handleOrder} className="space-y-6">
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-gray-900 border border-green-500 text-green-500 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">Link</label>
                <input
                  type="text"
                  value={orderLink}
                  onChange={(e) => setOrderLink(e.target.value)}
                  className="w-full bg-gray-900 border border-green-500 text-green-500 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-green-500 text-sm font-mono mb-2">Quantity</label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                  className="w-full accent-green-500"
                />
                <span className="text-green-500 font-mono">{orderQuantity}</span>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-gray-900 py-2 rounded font-bold hover:bg-green-400 transition-colors duration-200 font-mono flex items-center justify-center"
              >
                <Zap className="mr-2" />
                PLACE ORDER
              </button>
            </form>
            {orderStatus && (
              <p className="mt-4 text-green-500 text-center font-mono">{orderStatus}</p>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-green-500">
            <h2 className="text-xl font-bold text-green-500 mb-6 font-mono">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-green-500 border-b border-green-500 font-mono">
                    <th className="pb-4">Order ID</th>
                    <th className="pb-4">Service</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#1234', service: 'Twitch Viewers', status: 'Completed', date: '2024-03-10', amount: '$29.99' },
                    { id: '#1235', service: 'TikTok Live', status: 'Processing', date: '2024-03-09', amount: '$19.99' },
                    { id: '#1236', service: 'Kick Viewers', status: 'Pending', date: '2024-03-09', amount: '$39.99' },
                  ].map((order, index) => (
                    <tr key={index} className="border-b border-gray-700 font-mono">
                      <td className="py-4 text-green-500">{order.id}</td>
                      <td className="py-4 text-green-500">{order.service}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'Processing' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-green-500">{order.date}</td>
                      <td className="py-4 text-green-500">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;