import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { dashboardAPI } from '../../services/api';
import {
  UserGroupIcon,
  HeartIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Donors',
      value: stats?.totalDonors || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Blood Requests',
      value: stats?.totalRequests || 0,
      icon: HeartIcon,
      color: 'bg-red-500',
      change: '+8%',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '-5%',
    },
    {
      title: 'Messages',
      value: stats?.totalMessages || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500',
      change: '+15%',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to RedConnect Admin Panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Group Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Group Distribution</h3>
            <div className="space-y-3">
              {stats?.bloodGroupDistribution?.map((group, index) => (
                <div key={group.blood_group} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-600 font-semibold text-sm">{group.blood_group}</span>
                    </div>
                    <span className="text-gray-900">{group.blood_group}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{group.donor_count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max((group.donor_count / (stats?.totalDonors || 1)) * 100, 2)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Donors</h4>
                <div className="space-y-2">
                  {stats?.recentDonors?.slice(0, 3).map((donor, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{donor.fullname}</span>
                      <span className="text-gray-500">
                        {new Date(donor.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Requests</h4>
                <div className="space-y-2">
                  {stats?.recentRequests?.slice(0, 3).map((request, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{request.patient_name}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.urgency_level === 'immediate' ? 'bg-red-100 text-red-800' :
                          request.urgency_level === 'urgent' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.urgency_level}
                        </span>
                        <span className="text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <UserGroupIcon className="h-8 w-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">View All Donors</h4>
              <p className="text-sm text-gray-600">Manage donor information</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <HeartIcon className="h-8 w-8 text-red-600 mb-2" />
              <h4 className="font-medium text-gray-900">Blood Requests</h4>
              <p className="text-sm text-gray-600">Handle urgent requests</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Messages</h4>
              <p className="text-sm text-gray-600">Respond to inquiries</p>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">Reports</h4>
              <p className="text-sm text-gray-600">Generate analytics</p>
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
