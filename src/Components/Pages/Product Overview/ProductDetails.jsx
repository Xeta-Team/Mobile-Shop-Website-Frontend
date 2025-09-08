const ProductDetails = ({ productPrice, colors, storageOptions, selectedColor, setSelectedColor, selectedStorage, setSelectedStorage }) => (
  <div className="flex flex-col space-y-4">
    <p className="text-sm text-gray-500">Apple</p>
    <h1 className="text-4xl font-bold">Pre-Owned iPhone 16 Pro max</h1>
    <p className="text-3xl font-semibold pt-2">Rs {productPrice}</p>
    
    {/* Color Selector */}
    <div className="pt-2">
      <p className="text-md mb-2">Color: <span className="font-semibold">{selectedColor}</span></p>
      <div className="flex space-x-3">
        {colors.map(c => (
          <button
            key={c.name}
            onClick={() => setSelectedColor(c.name)}
            className={`w-8 h-8 rounded-full ${c.color} border-2 transition-all duration-200 ${selectedColor === c.name ? 'border-blue-500 scale-110' : 'border-gray-300'}`}
            aria-label={`Select color ${c.name}`}
          ></button>
        ))}
      </div>
    </div>

    {/* Storage Selector */}
    <div>
      <p className="text-md mb-2">Storage:</p>
      <div className="flex space-x-3">
        {storageOptions.map(storage => (
          <button
            key={storage}
            onClick={() => setSelectedStorage(storage)}
            className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
              selectedStorage === storage
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black hover:bg-gray-100'
            }`}
          >
            {storage}
          </button>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col space-y-4 pt-4">
      <button className="w-full bg-black text-white font-bold py-4 rounded-full hover:bg-gray-800 transition-colors">
        Add to cart - Rs {productPrice}
      </button>
      <button className="w-full bg-gray-700 text-white font-bold py-4 rounded-full hover:bg-gray-600 transition-colors">
        Buy it now
      </button>
    </div>
  </div>
);

export default ProductDetails