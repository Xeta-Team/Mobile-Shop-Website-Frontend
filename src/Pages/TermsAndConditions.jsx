import React from 'react';
import TopNavigationBar from '../Components/TopNavigationBar';
import Footer from '../Components/Footer';

// You can create this file in: front end/src/Pages/TermsAndConditions.jsx
export default function TermsAndConditionsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopNavigationBar />

      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Last updated: November 7, 2025
            </p>
          </div>

          <div className="mt-12 prose prose-lg max-w-none text-gray-700">
            {/* 'prose' is a Tailwind class that styles text content.
              It will make these h2, p, and ul tags look good.
              The text here is just placeholder.
            */}
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to [Your Shop Name]. These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.
            </p>

            <h2>2. Use of Our Service</h2>
            <p>
              You must be at least 18 years old to use our service. You agree to provide accurate and complete information when creating an account and to keep this information up to date. You are responsible for safeguarding your password and for any activities or actions under your password.
            </p>

            <h2>3. Products and Pricing</h2>
            <p>
              We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the site. However, we do not guarantee that they will be accurate, complete, reliable, or free of other errors.
            </p>
            <p>
              All prices are listed in Sri Lankan Rupees (LKR) and are subject to change without notice. We reserve the right to modify or discontinue a product at any time.
            </p>

            <h2>4. Orders and Payment</h2>
            <ul>
              <li>All orders are subject to acceptance and availability.</li>
              <li>We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies in product or pricing information, or problems identified by our fraud avoidance department.</li>
              <li>You agree to provide current, complete, and accurate purchase and account information for all purchases made.</li>
            </ul>

            <h2>5. Warranty Policy</h2>
            <p>
              Products sold by us are covered by the manufacturer's warranty. [Your Shop Name] provides its own warranty for certain pre-owned or specified items. Please refer to the specific product page or our dedicated Warranty Policy page for full details.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall [Your Shop Name], nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}