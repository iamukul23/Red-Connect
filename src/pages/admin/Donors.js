import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { donorsAPI } from '../../services/api';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [donorsPerPage] = useState(10);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await donorsAPI.getAll();
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error('Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonor = async (donorId) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await donorsAPI.delete(donorId);
        setDonors(donors.filter(donor => donor.id !== donorId));
        toast.success('Donor deleted successfully');
      } catch (error) {
        console.error('Error deleting donor:', error);
        toast.error('Failed to delete donor');
      }
    }
  };

  const handleToggleAvailability = async (donorId, currentStatus) => {
    try {
      await donorsAPI.updateAvailability(donorId, !currentStatus);
      setDonors(donors.map(donor => 
        donor.id === donorId 
          ? { ...donor, is_available: !currentStatus }
          : donor
      ));
      toast.success(`Donor ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating donor availability:', error);
      toast.error('Failed to update donor availability');
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.mobileno.includes(searchTerm) ||
                         donor.emailid?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = selectedBloodGroup === '' || donor.blood_group === selectedBloodGroup;
    return matchesSearch && matchesBloodGroup;
  });

  // Pagination
  const indexOfLastDonor = currentPage * donorsPerPage;
  const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstDonor, indexOfLastDonor);
  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  const DonorModal = ({ donor, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Donor Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{donor.fullname}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {donor.blood_group}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="mt-1 text-sm text-gray-900">{donor.age} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-sm text-gray-900">{donor.gender}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{donor.mobileno}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{donor.emailid || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Donation</label>
                <p className="mt-1 text-sm text-gray-900">
                  {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  donor.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {donor.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration IP</label>
                <p className="mt-1 text-sm text-gray-900">{donor.ip_address || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registered</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(donor.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1 text-sm text-gray-900">{donor.address}</p>
          </div>
          
          {donor.user_agent && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Device Information</label>
              <p className="mt-1 text-xs text-gray-500 break-all">{donor.user_agent}</p>
            </div>
          )}
          
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => handleToggleAvailability(donor.id, donor.is_available)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                donor.is_available
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {donor.is_available ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => handleDeleteDonor(donor.id)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Donors Management</h1>
            <p className="text-gray-600">Manage registered blood donors</p>
          </div>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Donor
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Donors Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{donor.fullname}</div>
                          <div className="text-sm text-gray-500">{donor.age} years, {donor.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {donor.blood_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donor.mobileno}</div>
                      <div className="text-sm text-gray-500">{donor.emailid || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        donor.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {donor.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDonor(donor);
                            setShowModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleAvailability(donor.id, donor.is_available)}
                          className={`${donor.is_available ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        >
                          {donor.is_available ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteDonor(donor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
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
                  Showing {indexOfFirstDonor + 1} to {Math.min(indexOfLastDonor, filteredDonors.length)} of {filteredDonors.length} donors
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
        {showModal && selectedDonor && (
          <DonorModal
            donor={selectedDonor}
            onClose={() => {
              setShowModal(false);
              setSelectedDonor(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Donors;
