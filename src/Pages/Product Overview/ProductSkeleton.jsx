import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Side: Image Gallery Skeleton */}
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-3">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex-1 bg-gray-200 rounded-lg h-[450px] animate-pulse"></div>
        </div>

        {/* Right Side: Product Details Skeleton */}
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-start">
            <div className="h-10 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-8 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="space-y-2.5">
            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-4/5 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;