import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import { messagesAPI } from '../../services/api';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  PhoneIcon,
  CalendarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterRead, setFilterRead] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await messagesAPI.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messagesAPI.markAsRead(messageId);
      setMessages(messages.map(message =>
        message.id === messageId
          ? { ...message, is_read: true }
          : message
      ));
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messagesAPI.delete(messageId);
        setMessages(messages.filter(message => message.id !== messageId));
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRead === 'all' || 
                         (filterRead === 'read' && message.is_read) ||
                         (filterRead === 'unread' && !message.is_read);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  const MessageModal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{message.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{message.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{message.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(message.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <p className="mt-1 text-sm text-gray-900">{message.ip_address || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <p className="text-lg font-medium text-gray-900">{message.subject}</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
          
          {message.user_agent && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Information</label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 break-all">{message.user_agent}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                message.is_read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {message.is_read ? 'Read' : 'Unread'}
              </span>
            </div>
            
            <div className="flex space-x-3">
              {!message.is_read && (
                <button
                  onClick={() => handleMarkAsRead(message.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Manage contact form messages</p>
          </div>
          <div className="flex items-center space-x-4">
            {unreadCount > 0 && (
              <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{unreadCount} unread</span>
              </div>
            )}
            <span className="text-sm text-gray-500">Total: {filteredMessages.length}</span>
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
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {message.is_read ? (
                          <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${!message.is_read ? 'text-gray-900 font-bold' : 'text-gray-900'}`}>
                            {message.name}
                          </div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${!message.is_read ? 'font-semibold text-gray-900' : 'text-gray-900'}`}>
                        {message.subject}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {message.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowModal(true);
                            if (!message.is_read) {
                              handleMarkAsRead(message.id);
                            }
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {!message.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
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
                  Showing {indexOfFirstMessage + 1} to {Math.min(indexOfLastMessage, filteredMessages.length)} of {filteredMessages.length} messages
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

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No messages have been received yet.'}
            </p>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedMessage && (
          <MessageModal
            message={selectedMessage}
            onClose={() => {
              setShowModal(false);
              setSelectedMessage(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Messages;
