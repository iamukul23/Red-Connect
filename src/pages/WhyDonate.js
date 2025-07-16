import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, UserGroupIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const WhyDonate = () => {
  const benefits = [
    {
      icon: HeartIcon,
      title: "Save Lives",
      description: "One blood donation can save up to three lives. Your donation could help someone's child, parent, or friend survive a medical emergency."
    },
    {
      icon: UserGroupIcon,
      title: "Help Your Community",
      description: "Blood donations stay in your local community to help patients at nearby hospitals and medical centers."
    },
    {
      icon: ClockIcon,
      title: "Quick & Easy Process",
      description: "The entire donation process takes only about 45-60 minutes, with the actual donation taking just 8-10 minutes."
    },
    {
      icon: ShieldCheckIcon,
      title: "Health Benefits",
      description: "Regular blood donation can help reduce iron levels, lower risk of heart disease, and provide a free health screening."
    }
  ];

  const facts = [
    "Every 2 seconds someone needs blood",
    "Only 3% of age-eligible people donate blood yearly",
    "One donation can help save up to 3 lives",
    "Blood cannot be manufactured – it can only come from generous donors",
    "Type O negative blood is the universal blood type",
    "Blood is needed for emergencies and for people who have cancer, blood disorders, sickle cell anemia and other illnesses"
  ];

  const requirements = [
    "Be at least 17 years old (16 with parental consent in some states)",
    "Weigh at least 110 pounds",
    "Be in good general health",
    "Not have donated blood in the last 56 days",
    "Have a valid ID",
    "Eat a healthy meal and drink plenty of water before donating"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Donate Blood?
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Blood donation is a simple act that can make a tremendous difference in the lives of others. 
              Here's why your donation matters and how it benefits both recipients and donors.
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 mb-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Be a Hero. Donate Blood.
            </h2>
            <p className="text-lg mb-6">
              Your single donation can save up to three lives. Join thousands of heroes making a difference.
            </p>
            <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Donate Now
            </button>
          </div>

          {/* Benefits Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Benefits of Blood Donation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Facts Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Blood Donation Facts
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{fact}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Donation Requirements
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 mb-6 text-center">
                Before you donate, make sure you meet these basic requirements:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requirements.map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                  >
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{requirement}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              The Donation Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Registration", desc: "Complete a brief health history questionnaire" },
                { step: "2", title: "Mini Physical", desc: "Quick check of temperature, blood pressure, and hemoglobin" },
                { step: "3", title: "Donation", desc: "The actual blood donation takes 8-10 minutes" },
                { step: "4", title: "Refreshments", desc: "Relax and enjoy snacks and drinks" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center"
                >
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Save Lives?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Schedule your blood donation appointment today and become a life-saving hero.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Donate Blood
              </button>
              <button className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Find Donation Center
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyDonate;
