import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bloodRequestsAPI } from '../services/api';
import { PhoneIcon, ClockIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';

const NeedBlood = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsRequired: '',
    hospitalName: '',
    hospitalAddress: '',
    contactPerson: '',
    phoneNumber: '',
    urgencyLevel: '',
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const urgencyLevels = [
    { value: 'immediate', label: 'Immediate (Within 2 hours)', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent (Within 24 hours)', color: 'text-orange-600' },
    { value: 'normal', label: 'Normal (Within 3 days)', color: 'text-yellow-600' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await bloodRequestsAPI.create(formData);
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          patientName: '',
          bloodGroup: '',
          unitsRequired: '',
          hospitalName: '',
          hospitalAddress: '',
          contactPerson: '',
          phoneNumber: '',
          urgencyLevel: '',
          additionalInfo: '',
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      // Show user-friendly error message
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to submit blood request. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your blood requirement request has been submitted. Our team will start searching for compatible donors and contact you soon.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>What happens next?</strong><br />
                1. We'll search our donor database for compatible matches<br />
                2. Notify potential donors in your area<br />
                3. Connect you with available donors<br />
                4. Provide emergency support if needed
              </p>
            </div>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need Blood?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Submit your blood requirement request and we'll help you find compatible donors quickly.
            </p>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <ClockIcon className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-red-900 font-semibold">Emergency?</h3>
                <p className="text-red-700 text-sm">
                  For immediate blood requirements, call our emergency helpline: 
                  <a href="tel:+1-800-BLOOD-NOW" className="font-bold ml-1 underline">+1-800-BLOOD-NOW</a>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter patient's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group.id} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Units Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unitsRequired"
                    value={formData.unitsRequired}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Number of units needed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Urgency Level</option>
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Name of the hospital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Name of contact person"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contact phone number"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Complete hospital address"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional information about the patient's condition or special requirements"
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Request...
                    </div>
                  ) : (
                    'Submit Blood Request'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <PhoneIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Our emergency helpline is available round the clock</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <ClockIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-600 text-sm">We respond to urgent requests within 30 minutes</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <MapPinIcon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Wide Network</h3>
              <p className="text-gray-600 text-sm">Connected with donors across multiple cities</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NeedBlood;
