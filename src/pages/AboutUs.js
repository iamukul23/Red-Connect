import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon, UserGroupIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AboutUs = () => {
  const values = [
    {
      icon: HeartIcon,
      title: "Compassion",
      description: "We believe in the power of human kindness and the importance of helping those in need."
    },
    {
      icon: UserGroupIcon,
      title: "Community",
      description: "Building strong connections between donors and recipients to create a supportive network."
    },
    {
      icon: LightBulbIcon,
      title: "Innovation",
      description: "Using modern technology to make blood donation more accessible and efficient."
    },
    {
      icon: ShieldCheckIcon,
      title: "Trust",
      description: "Maintaining the highest standards of safety, privacy, and reliability in all our operations."
    }
  ];

  const team = [
    {
      name: "Sarthak Routray",
      role: "Founder & CEO",
      image: "",
      description: "Passionate about leveraging technology to save lives and create meaningful connections between donors and recipients"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Lives Saved" },
    { number: "5,000+", label: "Active Donors" },
    { number: "50+", label: "Partner Hospitals" },
    { number: "24/7", label: "Emergency Support" }
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
              About RedConnect
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Blood Donation Management System - Connecting heroes with those who need them most. 
              We're on a mission to save lives through innovative technology and compassionate service.
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-6">
                  To create a seamless, technology-driven platform that connects blood donors with recipients, 
                  ensuring that no life is lost due to blood shortage. We believe that every person has the 
                  potential to be a hero, and we're here to make that heroism accessible and impactful.
                </p>
                <p className="text-gray-600">
                  Founded in 2025, RedConnect has revolutionized how blood donation works by eliminating barriers 
                  and creating direct connections between those who can give and those who need to receive.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="/image/blood_donationcover.jpeg" 
                  alt="Blood Donation" 
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-primary-600 bg-opacity-20 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Meet Our Founder
            </h2>
            <div className="flex justify-center">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-600 mb-4">
                RedConnect was born out of a personal experience. When our founder's child needed an emergency blood 
                transfusion, the traditional blood bank system proved to be slow and inefficient. Hours were 
                spent trying to locate compatible donors, and valuable time was lost.
              </p>
              <p className="text-gray-600 mb-4">
                This experience highlighted the critical need for a more efficient, technology-driven approach 
                to blood donation management. We realized that there were many willing donors in the community, 
                but no effective way to connect them with those in need quickly.
              </p>
              <p className="text-gray-600 mb-4">
                Today, RedConnect serves as a bridge between donors and recipients, using modern technology to save 
                precious time and ultimately, precious lives. Our platform has facilitated thousands of 
                successful blood donations and continues to grow our community of life-savers every day.
              </p>
              <p className="text-gray-600">
                We're not just a blood donation platform – we're a community of heroes working together to 
                ensure that no one suffers due to blood shortage.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-white text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Mission
            </h2>
            <p className="text-lg mb-6">
              Be part of a community that's dedicated to saving lives. Whether you're a donor or someone 
              who might need blood in the future, we're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Become a Donor
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
