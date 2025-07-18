import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { bloodRequestsAPI } from '../../services/api';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'fulfilled', label: 'Fulfilled', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const urgencyOptions = [
    { value: 'immediate', label: 'Immediate', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
    { value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800', icon: ClockIcon },
    { value: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-800', icon: ClockIcon }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await bloodRequestsAPI.getAll();
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load blood requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await bloodRequestsAPI.updateStatus(requestId, newStatus);
      setRequests(requests.map(request =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      ));
      toast.success('Request status updated successfully');
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.blood_group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || request.status === selectedStatus;
    const matchesUrgency = selectedUrgency === '' || request.urgency_level === selectedUrgency;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency) => {
    const urgencyOption = urgencyOptions.find(option => option.value === urgency);
    return urgencyOption ? urgencyOption.color : 'bg-gray-100 text-gray-800';
  };

  const RequestModal = ({ request, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Blood Request Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{request.patient_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {request.blood_group}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Units Required</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{request.units_required} units</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency_level)}`}>
                  {request.urgency_level.charAt(0).toUpperCase() + request.urgency_level.slice(1)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    className="ml-2 text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <p className="mt-1 text-sm text-gray-900">{request.hospital_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                <p className="mt-1 text-sm text-gray-900">{request.contact_person}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">{request.phone_number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created At</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(request.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(request.updated_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Request IP</label>
                <p className="mt-1 text-sm text-gray-900">{request.ip_address || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Hospital Address</label>
            <p className="mt-1 text-sm text-gray-900">{request.hospital_address}</p>
          </div>
          
          {request.additional_info && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Additional Information</label>
              <p className="mt-1 text-sm text-gray-900">{request.additional_info}</p>
            </div>
          )}
          
          {request.user_agent && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Device Information</label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 break-all">{request.user_agent}</p>
              </div>
            </div>
          )}
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
            <p className="text-gray-600">Manage blood donation requests</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total: {filteredRequests.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Urgency</option>
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <HeartIcon className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.patient_name}</div>
                          <div className="text-sm text-gray-500">{request.units_required} units needed</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {request.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.hospital_name}</div>
                      <div className="text-sm text-gray-500">{request.contact_person}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency_level)}`}>
                        {request.urgency_level.charAt(0).toUpperCase() + request.urgency_level.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <select
                          value={request.status}
                          onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstRequest + 1} to {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} requests
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedRequest && (
          <RequestModal
            request={selectedRequest}
            onClose={() => {
              setShowModal(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default BloodRequests;
