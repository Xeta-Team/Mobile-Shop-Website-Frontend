import React from 'react';
import TopNavigationBar from '../Components/TopNavigationBar';
import Footer from '../Components/Footer';
import { Users, Target, Eye } from 'lucide-react';

// You can create this file in: front end/src/Pages/AboutUs.jsx
export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopNavigationBar />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About Us
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Your trusted partner for premium electronics in Sri Lanka.
            </p>
          </div>

          {/* Our Story Section */}
          <div className="mt-16 text-lg text-gray-700 space-y-6">
            <p>
              Welcome to CellExpress! We began with a simple idea: to make the world's best technology accessible to everyone in Sri Lanka, paired with service you can trust. What started as a small passion project has grown into a leading destination for premium devices like Apple, Samsung, and more.
            </p>
            <p>
              Our journey is built on a foundation of authenticity and customer care. We believe that buying a new device should be an exciting and seamless experience, which is why we source 100% genuine products and back them with expert knowledge.
            </p>
          </div>

          {/* Mission & Vision Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Our Mission */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <Target className="w-10 h-10 text-gray-900" />
                <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
              </div>
              <p className="mt-4 text-gray-700">
                To provide our customers with authentic, high-quality electronics at competitive prices, ensuring an honest, simple, and satisfying shopping experience from start to finish.
              </p>
            </div>

            {/* Our Vision */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <Eye className="w-10 h-10 text-gray-900" />
                <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
              </div>
              <p className="mt-4 text-gray-700">
                To be Sri Lanka's most trusted name in technology retail, known for our unwavering commitment to quality, integrity, and customer-centric service.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}