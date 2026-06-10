const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading CampusConnect...</p>
      </div>
    </div>
  );
};

export default Loader;