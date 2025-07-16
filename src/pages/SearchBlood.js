import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { donorsAPI } from '../services/api';

const SearchBlood = () => {
  const [searchData, setSearchData] = useState({
    bloodGroup: '',
    location: '',
  });

  const [isSearching, setIsSearching] = useState(false);
  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const bloodGroups = [
    { id: 1, name: 'A+' },
    { id: 2, name: 'A-' },
    { id: 3, name: 'B+' },
    { id: 4, name: 'B-' },
    { id: 5, name: 'AB+' },
    { id: 6, name: 'AB-' },
    { id: 7, name: 'O+' },
    { id: 8, name: 'O-' },
  ];

  // Mock donor data
  const mockDonors = [
    {
      id: 1,
      name: 'John Doe',
      bloodGroup: 'A+',
      location: 'New York',
      phone: '+1-234-567-8900',
      lastDonation: '2024-10-15',
      available: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      bloodGroup: 'A+',
      location: 'New York',
      phone: '+1-234-567-8901',
      lastDonation: '2024-09-20',
      available: true,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      bloodGroup: 'A+',
      location: 'Brooklyn',
      phone: '+1-234-567-8902',
      lastDonation: '2024-11-01',
      available: false,
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      bloodGroup: 'B+',
      location: 'Manhattan',
      phone: '+1-234-567-8903',
      lastDonation: '2024-10-10',
      available: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await donorsAPI.search({
        bloodGroup: searchData.bloodGroup,
        location: searchData.location
      });
      
      if (response.status === 200) {
        // Server returns result.rows directly, not wrapped in donors property
        setDonors(response.data || []);
        console.log('Search results:', response.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      
      // Show user-friendly error message
      if (error.response?.data?.message) {
        alert(`Search Error: ${error.response.data.message}`);
      } else {
        alert('Failed to search for donors. Please check your connection and try again.');
      }
      
      // Set empty results on error
      setDonors([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleContact = (donor) => {
    // In a real app, this would open a contact modal or redirect to a contact form
    alert(`Contacting ${donor.fullname} at ${donor.mobileno}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Search Blood Donors
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find available blood donors by blood group and location. Connect with life-savers in your area.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={searchData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Blood Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={searchData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter city or area"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={`w-full px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                      isSearching
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    } text-white`}
                  >
                    {isSearching ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                        Search Donors
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Results
                  </h2>
                  <span className="text-sm text-gray-600">
                    {donors.length} donor{donors.length !== 1 ? 's' : ''} found
                  </span>
                </div>

                {donors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No donors found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or check back later.
                    </p>
                    <button
                      onClick={() => {
                        setSearchData({ bloodGroup: '', location: '' });
                        setHasSearched(false);
                        setDonors([]);
                      }}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donors.map((donor, index) => (
                      <motion.div
                        key={donor.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`border rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
                          donor.available 
                            ? 'border-green-200 bg-green-50 hover:border-green-300' 
                            : 'border-gray-200 bg-gray-50 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {donor.fullname}
                            </h3>
                            <div className="flex items-center mt-1">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                donor.is_available ? 'bg-green-500' : 'bg-gray-400'
                              }`}></span>
                              <span className={`text-sm ${
                                donor.is_available ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {donor.is_available ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                              {donor.blood_group}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{donor.address}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{donor.mobileno}</span>
                          </div>
                          {donor.last_donation_date && (
                            <div className="text-sm text-gray-500">
                              Last donation: {new Date(donor.last_donation_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleContact(donor)}
                          disabled={!donor.is_available}
                          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                            donor.is_available
                              ? 'bg-primary-600 hover:bg-primary-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {donor.is_available ? 'Contact Donor' : 'Unavailable'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Emergency Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Emergency Blood Requirement?
                </h3>
                <p className="text-red-700 mb-4">
                  If you need blood urgently, please contact our emergency helpline or visit the nearest blood bank.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+1-800-BLOOD-NOW"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center"
                  >
                    Call Emergency Helpline
                  </a>
                  <button className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Find Blood Banks
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchBlood;
