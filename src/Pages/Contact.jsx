import React, { useState } from 'react';
import TopNavigationBar from '../Components/TopNavigationBar';
import Footer from '../Components/Footer';
import { Phone, Mail, MapPin, Send, Loader, CheckCircle } from 'lucide-react';
import apiClient from './api/axiosConfig';

// You can create this file in: front end/src/Pages/Contact.jsx
export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
        // Use the new backend endpoint!
        await apiClient.post('/api/contact', formData); 
        
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });

    } catch (error) {
        console.error('Submission failed:', error);
        setStatus('error');
        // You might want to show a more specific error message here
        // toast.error(error.response.data.message || 'Failed to send message.');
        setTimeout(() => setStatus('idle'), 3000); // Reset status after a delay
    }
};

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopNavigationBar />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              We're here to help. Send us a message or visit us in-store.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-400"
                  >
                    {status === 'sending' && <Loader className="animate-spin" size={18} />}
                    {status !== 'sending' && <Send size={18} />}
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                  {status === 'success' && (
                    <p className="text-green-600 mt-4 flex items-center gap-2">
                      <CheckCircle size={20} /> Message sent! We'll get back to you soon.
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-gray-900">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-gray-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">For support, sales, or any inquiries.</p>
                    <a href="mailto:info@yourshop.com" className="text-gray-900 font-medium hover:underline">
                      info@yourshop.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-gray-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">Give us a call during business hours.</p>
                    <a href="tel:+94XXXXXXXXX" className="text-gray-900 font-medium hover:underline">
                      +94 XX XXX XXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gray-800 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">
                      No. 123, Galle Road,
                      <br />
                      Colombo 03, Sri Lanka
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}