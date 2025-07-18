import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { reportsAPI } from '../../services/api';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      const response = await reportsAPI.getReportData(selectedPeriod);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      const response = await reportsAPI.exportReport(format, selectedPeriod);
      // Create a blob from the response
      const blob = new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : 'text/csv' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `redconnect_report_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.startsWith('+') ? <TrendingUpIcon className="h-4 w-4 mr-1" /> : <TrendingDownIcon className="h-4 w-4 mr-1" />}
              {change} from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const BloodGroupChart = ({ data }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Group Distribution</h3>
      <div className="space-y-4">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-semibold text-red-600">{item.blood_group}</span>
              </div>
              <span className="text-sm text-gray-600">Blood Group {item.blood_group}</span>
            </div>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${(item.count / Math.max(...data.map(d => d.count))) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RequestStatusChart = ({ data }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status Distribution</h3>
      <div className="space-y-4">
        {data?.map((item, index) => {
          const colors = {
            pending: 'bg-yellow-600',
            in_progress: 'bg-blue-600',
            fulfilled: 'bg-green-600',
            cancelled: 'bg-red-600'
          };
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${colors[item.status]}`}></div>
                <span className="text-sm text-gray-600 capitalize">{item.status}</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className={`${colors[item.status]} h-2 rounded-full`}
                    style={{ width: `${(item.count / Math.max(...data.map(d => d.count))) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TopDonorsTable = ({ data }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Donors</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Donation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((donor, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{donor.fullname}</div>
                      <div className="text-sm text-gray-500">{donor.mobileno}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {donor.blood_group}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donor.donation_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into blood donation activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => handleExportReport('csv')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Donors"
            value={reportData?.totalDonors || 0}
            change={reportData?.donorGrowth}
            icon={UserGroupIcon}
            color="bg-blue-500"
          />
          <StatCard
            title="Blood Requests"
            value={reportData?.totalRequests || 0}
            change={reportData?.requestGrowth}
            icon={HeartIcon}
            color="bg-red-500"
          />
          <StatCard
            title="Successful Donations"
            value={reportData?.successfulDonations || 0}
            change={reportData?.donationGrowth}
            icon={TrendingUpIcon}
            color="bg-green-500"
          />
          <StatCard
            title="Messages Received"
            value={reportData?.totalMessages || 0}
            change={reportData?.messageGrowth}
            icon={ChatBubbleLeftRightIcon}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BloodGroupChart data={reportData?.bloodGroupDistribution} />
          <RequestStatusChart data={reportData?.requestStatusDistribution} />
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Timeline</h3>
          <div className="space-y-4">
            {reportData?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'donation' ? 'bg-green-100' :
                    activity.type === 'request' ? 'bg-red-100' :
                    activity.type === 'message' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'donation' && <HeartIcon className="h-4 w-4 text-green-600" />}
                    {activity.type === 'request' && <HeartIcon className="h-4 w-4 text-red-600" />}
                    {activity.type === 'message' && <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'donor' && <UserGroupIcon className="h-4 w-4 text-gray-600" />}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Donors Table */}
        {reportData?.topDonors && (
          <TopDonorsTable data={reportData.topDonors} />
        )}

        {/* Monthly Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{reportData?.monthlyStats?.newDonors || 0}</div>
              <div className="text-sm text-gray-500">New Donors This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{reportData?.monthlyStats?.newRequests || 0}</div>
              <div className="text-sm text-gray-500">New Requests This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{reportData?.monthlyStats?.fulfilledRequests || 0}</div>
              <div className="text-sm text-gray-500">Fulfilled Requests This Month</div>
            </div>
          </div>
        </div>

        {/* Emergency Alerts */}
        {reportData?.emergencyAlerts && reportData.emergencyAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Alerts</h3>
            <div className="space-y-3">
              {reportData.emergencyAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-800">{alert.message}</span>
                  </div>
                  <span className="text-xs text-red-600">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;
