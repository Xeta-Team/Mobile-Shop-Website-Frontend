import React, { useState } from 'react';
import axios from 'axios';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { CheckCircle, Sparkles, Loader, AlertTriangle, Plus, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Added for smooth step transitions

// --- Supabase Configuration (unchanged) ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// --- Gemini API Configuration (unchanged) ---
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// --- Category Definitions (unchanged) ---
const DETAILED_VARIANT_CATEGORIES = ['iPhone', 'iPad', 'Mac', 'Other Phone', 'iWatch'];
const ACCESSORY_CATEGORIES = [
    'Power & Charging',
    'Airpods',
    'Headphone',
    'Accessories (Protection & Add-ons)',
    'Connectivity / Storage'
];
const ALL_CATEGORIES = [...DETAILED_VARIANT_CATEGORIES, ...ACCESSORY_CATEGORIES];


// --- Helper Components (All unchanged, already responsive) ---
function FormSection({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function InputField({ id, label, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
            <input id={id} name={id} {...props} className={`mt-2 w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`} />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

function SelectField({ id, label, children, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
            <select id={id} name={id} {...props} className="mt-2 w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {children}
            </select>
        </div>
    );
}

function ColorPickerField({ name, hex, onNameChange, onHexChange }) {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-700">Color</label>
            <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <input
                    id="colorHex"
                    name="colorHex"
                    type="color"
                    value={hex}
                    onChange={onHexChange}
                    className="w-full sm:w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer flex-shrink-0"
                />
                <div className="flex-grow">
                    <input
                        id="colorName"
                        name="colorName"
                        placeholder="Color Name (e.g., Midnight Black)"
                        value={name}
                        onChange={onNameChange}
                        className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 focus:ring-indigo-500"
                    />
                </div>
            </div>
        </div>
    );
}


function ImageUploadField({ id, label, onFileChange, disabled }) {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileChange(file);
        }
    };

    return (
        <div>
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-24 h-24 rounded-lg bg-gray-100 border border-dashed flex items-center justify-center flex-shrink-0">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <ImageIcon className="text-gray-400" size={32} />
                    )}
                </div>
                <label htmlFor={id} className={`w-full sm:w-auto text-center cursor-pointer bg-white text-sm font-semibold text-indigo-600 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    Choose File
                    <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={disabled} />
                </label>
            </div>
        </div>
    );
}


// --- Main Component ---
export default function AddProductPage() {
    // --- STATE ---
    const [formData, setFormData] = useState({
        name: '', brand: '', description: '', category: '', base_image: '',
        sku: '', colorName: '', colorHex: '#ffffff', storage: '', condition: 'New', packaging: '',
        price: '', stock_quantity: '', image_url: '',
    });

    const [baseImageFile, setBaseImageFile] = useState(null);
    const [variantImageFile, setVariantImageFile] = useState(null);
    
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    // --- STEPPER STATE ---
    const [step, setStep] = useState(1);

    // --- HANDLERS (unchanged) ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = async (file) => {
        if (!file) return null;
        if (!supabase) {
            throw new Error("Supabase is not configured. Please add your URL and Anon Key.");
        }
        const fileName = `${Date.now()}_${file.name.replace(/ /g, '_')}`;
        const filePath = `public/${fileName}`;
        const { error } = await supabase.storage.from('Images').upload(filePath, file);
        if (error) {
            console.error('Error uploading image to Supabase:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
        const { data } = supabase.storage.from('Images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleGenerateDescription = async () => {
        // ... (function is unchanged) ...
        if (!formData.name || !formData.brand) {
            setMessage('Please enter a Product Name and Brand first.');
            setIsSuccess(false);
            return;
        }
        if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_API_KEY') {
            setMessage('Google API Key is not configured.');
            setIsSuccess(false);
            return;
        }
        setIsGeneratingDesc(true);
        setMessage('');
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const systemPrompt = "Act as an expert e-commerce copywriter for a mobile phone and electronics store in Sri Lanka. Write a compelling, SEO-friendly product description. Make it exciting and highlight key features, but keep it concise (around 2-3 paragraphs).";
        const userQuery = `Product Name: ${formData.name}, Brand: ${formData.brand}`;
        const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) {
                setFormData(prev => ({ ...prev, description: generatedText }));
                setMessage('Description generated successfully!');
                setIsSuccess(true);
            } else {
                throw new Error("Received an empty response from the AI.");
            }
        } catch (error) {
            setMessage("Failed to generate description. Please try again.");
            setIsSuccess(false);
        } finally {
            setIsGeneratingDesc(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSuccess(false);
        setIsUploading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authentication error. Please log in again.");
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            let finalFormData = { ...formData };
            if (baseImageFile) finalFormData.base_image = await handleImageUpload(baseImageFile);
            if (variantImageFile) finalFormData.image_url = await handleImageUpload(variantImageFile);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products/addProduct`, finalFormData, config);
            
            setMessage(response.data.message);
            setIsSuccess(true);
            
            // Reset variant fields and go back to step 2 to add another
            setFormData(prev => ({
                ...prev,
                sku: '', colorName: '', colorHex: '#ffffff', storage: '', condition: 'New',
                packaging: '', price: '', stock_quantity: '', image_url: ''
            }));
            setVariantImageFile(null); // Clear variant image file
            // No need to change step, user might want to add another variant

        } catch (error) {
            const errorMessage = error.message || error.response?.data?.message || 'An error occurred during submission.';
            setMessage(errorMessage);
            setIsSuccess(false);
        } finally {
            setIsUploading(false);
        }
    };

    // --- Computed Values ---
    const showDetailedFields = DETAILED_VARIANT_CATEGORIES.includes(formData.category);
    const showVariantImage = !ACCESSORY_CATEGORIES.includes(formData.category);
    const isSupabaseConfigured = supabase !== null;
    const isGeminiConfigured = GOOGLE_API_KEY && GOOGLE_API_KEY !== 'YOUR_GOOGLE_API_KEY';
    const isParentInfoValid = formData.name && formData.brand && formData.category;

    // --- Animation Variants ---
    const stepAnimation = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 30 },
        transition: { duration: 0.3, ease: "easeInOut" }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6 sm:mb-8">
                    {/* --- RESPONSIVE TWEAK: Dynamic Header --- */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        {step === 1 ? 'Step 1: Product Information' : 'Step 2: Add Variant'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {step === 1 ? 'Enter general details for the product.' : `Adding variant(s) for: ${formData.name}`}
                    </p>
                </header>

                {/* --- Warnings (unchanged, already responsive) --- */}
                {!isSupabaseConfigured && (
                    <div className="p-4 rounded-lg mb-6 flex items-center gap-3 bg-yellow-100 text-yellow-800">
                        <AlertTriangle size={20} />
                        <span><strong>Warning:</strong> Supabase is not configured. Image uploads are disabled.</span>
                    </div>
                )}
                 {!isGeminiConfigured && (
                    <div className="p-4 rounded-lg mb-6 flex items-center gap-3 bg-yellow-100 text-yellow-800">
                        <AlertTriangle size={20} />
                        <span><strong>Warning:</strong> Google API Key is not configured. "Generate Description" is disabled.</span>
                    </div>
                )}

                {/* --- Message Area (unchanged) --- */}
                {message && (
                    <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isSuccess ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        <span>{message}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- RESPONSIVE TWEAK: Added Stepper Logic --- */}
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" {...stepAnimation} className="space-y-6">
                                <FormSection title="Parent Product Information">
                                    <InputField id="name" label="Product Name" placeholder="e.g., iPhone 14 Pro" value={formData.name} onChange={handleChange} required />
                                    <InputField id="brand" label="Brand" placeholder="e.g., Apple" value={formData.brand} onChange={handleChange} required />
                                    <SelectField id="category" label="Category" value={formData.category} onChange={handleChange} required>
                                        <option value="" disabled>Select a category</option>
                                        {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </SelectField>
                                    <div className="relative">
                                        <label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</label>
                                        <textarea id="description" name="description" placeholder="General description for the product." value={formData.description} onChange={handleChange} className="mt-2 w-full p-3 h-32 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                        <button
                                            type="button"
                                            onClick={handleGenerateDescription}
                                            disabled={!formData.name || isGeneratingDesc || !isGeminiConfigured}
                                            className="absolute top-8 right-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                                        >
                                            {isGeneratingDesc ? <Loader className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                            {isGeneratingDesc ? 'Generating...' : '✨ Generate'}
                                        </button>
                                    </div>
                                    <ImageUploadField id="base_image" label="Base Image (for product page)" onFileChange={setBaseImageFile} disabled={!isSupabaseConfigured} />
                                </FormSection>
                                
                                <div className="flex justify-end pt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(2)} 
                                        disabled={!isParentInfoValid} 
                                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                                    >
                                        Next: Add Variant Details <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && formData.category && (
                            <motion.div key="step2" {...stepAnimation} className="space-y-6">
                                <FormSection title="Specific Variant Details">
                                    <InputField id="sku" label="SKU (Unique Identifier)" placeholder="e.g., IPH14PRO-256-BLK-USED" name="sku" value={formData.sku} onChange={handleChange} required />
                                    {showVariantImage && (
                                        <ImageUploadField id="variant_image" label="Variant Image (optional)" onFileChange={setVariantImageFile} disabled={!isSupabaseConfigured} />
                                    )}
                                    {showDetailedFields && (
                                        <>
                                            <ColorPickerField name={formData.colorName} hex={formData.colorHex} onNameChange={handleChange} onHexChange={handleChange} />
                                            <InputField id="storage" label="Storage" placeholder="e.g., 256GB" name="storage" value={formData.storage} onChange={handleChange} />
                                            <SelectField id="condition" label="Condition" name="condition" value={formData.condition} onChange={handleChange} required>
                                                <option value="New">New</option>
                                                <option value="Used">Used</option>
                                            </SelectField>
                                            <InputField id="packaging" label="Packaging" placeholder="e.g., Full Set Box" name="packaging" value={formData.packaging} onChange={handleChange} />
                                        </>
                                    )}
                                    <InputField id="price" label="Price (LKR)" type="number" name="price" placeholder="e.g., 350000" value={formData.price} onChange={handleChange} required />
                                    <InputField id="stock_quantity" label="Stock Quantity" name="stock_quantity" type="number" placeholder="e.g., 10" value={formData.stock_quantity} onChange={handleChange} required />
                                </FormSection>
                                
                                <div className="flex flex-col-reverse sm:flex-row justify-between pt-4 gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setStep(1)} 
                                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isUploading || !isSupabaseConfigured} 
                                        className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
                                        {isUploading ? 'Uploading...' : 'Add Variant'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>
        </div>
    );
}