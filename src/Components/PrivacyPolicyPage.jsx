
import React from 'react';
import TopNavigationBar from './TopNavigationBar';
import Footer from './Footer';

const PrivacyPolicyPage = () => {
    // Define the custom primary accent color (now white/gray for monochrome emphasis)
    const primaryAccent = '#CCCCCC'; // Light gray for subtle emphasis
    // Define a lighter shade for hover effects (subtle white glow/shadow)
    const cardHoverShadow = 'rgba(255, 255, 255, 0.1)';

    // Custom CSS for the base styling and list appearance
    const customStyles = `
        /* Base Dark Theme Styling */
        .antialiased {
            font-family: 'Inter', sans-serif;
            background-color: #000000; /* Pure black background */
            color: #f3f4f6; /* Light gray text */
        }
        /* Links use the brand accent color (white for contrast) */
        a {
            color: #FFFFFF; 
            text-decoration: underline;
            transition: color 0.2s ease-in-out;
        }
        /* Custom list style with neon accent bullet (now white/gray) */
        .policy-list li {
            padding-left: 1.5rem; 
            position: relative;
        }
        .policy-list li::before {
            content: "•";
            color: ${primaryAccent}; /* White/Gray bullet */
            font-weight: bold;
            position: absolute;
            left: 0;
            top: 0;
        }
        /* Style for the card sections */
        .policy-card {
            background-color: #1a1a1a; /* Dark gray for cards */
            border-radius: 0.75rem; /* rounded-xl */
            padding: 2rem; /* p-8 */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6); /* subtle dark shadow */
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; /* Add animation transition */
        }
        /* Hover animation effect */
        .policy-card:hover {
            transform: translateY(-4px) scale(1.005); /* Slightly lift and scale the card */
            box-shadow: 0 8px 20px ${cardHoverShadow}; /* Subtle white shadow glow on hover */
        }
    `;
    
    // The introductory text shown in the screenshot
    const whoWeAreText = "Thank you for visiting CellExpress! We are a company, Reselling Mobile products. Please read this Privacy Policy, providing consent to document, in order to have permission to use our services.";
    

    return (
        <div className="antialiased min-h-screen flex flex-col">
            <style>{customStyles}</style>
            
            {/* 1. TOP NAVIGATION BAR */}
            <TopNavigationBar />

            <div className="flex-grow">
                {/* Header / Title Section - Dark background with the neon effect visual concept (simplifed) */}
                <header className="bg-gray-900 py-16 text-white text-center" 
                    // Changed background gradient to use subtle gray/black instead of pink tint
                    style={{backgroundImage: 'radial-gradient(ellipse at center, rgba(100, 100, 100, 0.1) 0%, rgba(0,0,0,0) 70%)'}}>
                    <div className="max-w-4xl mx-auto px-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Privacy Policy
                        </h1>
                    </div>
                </header>

                {/* Policy Content Section */}
                <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-8">
                    
                    {/* WHO WE ARE Section */}
                    <div className="text-center mb-10">
                        <h2 className="text-xl font-bold mb-4" style={{color: primaryAccent}}>WHO WE ARE</h2>
                        <p className="text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto">
                            {whoWeAreText}
                        </p>
                    </div>

                    {/* 1. Information We Collect Card - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
                        <p className="text-gray-300">
                            When you use our Site, we may collect personal information from you such as your name, email address, phone number, shipping and billing addresses, and payment information. We may also collect non-personal information, such as your IP address, browser type, and operating system.
                        </p>
                    </div>

                    {/* 2. How We Use Your Information Card (Part 1) - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
                        <p className="text-gray-300">
                            We use your personal information to fulfill your orders, communicate with you about your orders and our products, and improve our Site and customer service. We may also use your information to send you marketing emails and newsletters, but you can opt-out of receiving these emails at any time by clicking on the unsubscribe link at the bottom of the email.
                        </p>
                    </div>

                    {/* 2. How We Use Your Information Card (Part 2 - Bullet Points) - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">We collect your information for a variety of reasons, including to:</h2>
                        <ul className="policy-list list-none space-y-2 text-gray-300 text-base">
                            <li>Process and fulfill your orders and transactions.</li>
                            <li>Communicate with you about your orders, products, services, and promotions.</li>
                            <li>Provide customer support and respond promptly to your inquiries.</li>
                            <li>Improve our products, services, and website functionality and user experience.</li>
                            <li>Personalize your shopping experience and tailor product recommendations.</li>
                            <li>Conduct research and analytics to better understand customer behavior.</li>
                            <li>Comply with applicable laws and regulations and protect our legal rights.</li>
                        </ul>
                    </div>

                    {/* 3. How We Protect Your Information Card - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">3. How We Protect Your Information</h2>
                        <p className="text-gray-300">
                            We are committed to the security of your personal information and use **reasonable measures** to protect it from unauthorized access, disclosure, or alteration. These measures include implementing **encryption**, **firewalls**, and **Secure Socket Layer (SSL)** technology where appropriate.
                        </p>
                        {/* Warning box adapted for dark theme and monochrome */}
                        <p className="bg-gray-700/50 border-l-4 border-gray-500 text-gray-300 p-4 rounded-md text-base">
                            **Note:** However, please understand that no method of transmission over the internet or electronic storage is 100% secure, and therefore, we cannot guarantee the absolute security of your information.
                        </p>
                    </div>

                    {/* 4. Disclosure of Your Information Card - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">4. Disclosure of Your Information</h2>

                        {/* 4A. Service Providers */}
                        <div className="pl-4 border-l-4 border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-300 mt-2 mb-3">A. Service Providers</h3>
                            <p className="text-gray-400">
                                We may share your personal information with our **trusted service providers** who assist us in operating our Site and fulfilling your orders. This includes partners like:
                            </p>
                            <ul className="policy-list list-none mt-3 space-y-2 text-gray-400 text-base">
                                <li>Shipping and logistics companies.</li>
                                <li>Payment processors (who handle your payment information securely).</li>
                                <li>IT and hosting services.</li>
                            </ul>
                        </div>

                        {/* 4B. Legal and Safety Requirements */}
                        <div className="pl-4 border-l-4 border-gray-700 mt-4">
                            <h3 className="text-xl font-semibold text-gray-300 mt-4 mb-3">B. Legal and Safety Requirements</h3>
                            <p className="text-gray-400">
                                We may also disclose your information when required to do so by law, such as:
                            </p>
                            <ul className="policy-list list-none mt-3 space-y-2 text-gray-400 text-base">
                                <li>In response to a **subpoena, court order, or other legal requirement**.</li>
                                <li>To **protect our rights, property, or safety** and the safety of our users or the public.</li>
                            </ul>
                        </div>
                    </div>

                    {/* 5. Third-Party Links Card - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">5. Third-Party Links</h2>
                        <p className="text-gray-300">
                            Our Site may contain links to **third-party websites or services** that are not owned or operated by us. We provide these links solely for your convenience.
                        </p>
                        <p className="text-gray-300">
                            We are **not responsible** for the privacy practices, content, or security of these third-party sites. We strongly encourage you to review their respective privacy policies before providing any personal information.
                        </p>
                    </div>
                    
                    {/* 6. Changes to Our Privacy Policy Card - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">6. Changes to Our Privacy Policy</h2>
                        <p className="text-gray-300">
                            We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the updated policy on this Site, noting the new "Last Updated" date.
                        </p>
                        <p className="font-bold text-lg" style={{ color: primaryAccent }}>
                            **Your continued use of the Site after any changes to the Privacy Policy will constitute your acceptance of the changes.**
                        </p>
                    </div>
                    
                    {/* 7. Contact Us Card - ANIMATED */}
                    <div className="policy-card space-y-4 cursor-pointer">
                        <h2 className="text-2xl font-bold text-white">7. Contact Us</h2>
                        <p className="text-gray-300">
                            If you have any questions or concerns about this Privacy Policy or our use of your personal information, please contact us at:
                        </p>
                        {/* Contact box uses a subtle background using the accent color tint */}
                        <div 
                            className="p-4 rounded-xl border border-gray-700 transition duration-300 hover:shadow-lg"
                            style={{ backgroundColor: 'rgba(100, 100, 100, 0.1)', borderColor: 'rgba(100, 100, 100, 0.3)' }}
                        >
                            <p className="font-semibold text-xl text-gray-300">
                                Email: <a 
                                    href="mailto:support@cellexpress.lk" 
                                    className="underline transition duration-150 hover:text-white" 
                                >
                                    support@cellexpress.lk
                                </a>
                            </p>
                        </div>
                    </div>
                    
                </main>
            </div>
            
            {/* 2. FOOTER */}
            <Footer />

        </div>
    );
};

export default PrivacyPolicyPage;
