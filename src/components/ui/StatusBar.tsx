
export const StatusBar = () => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex justify-between items-center px-6 py-2 text-sm font-semibold text-black bg-transparent">
      <div className="text-left">
        {getCurrentTime()}
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-2 bg-black rounded-sm opacity-60">
          <div className="w-3 h-1.5 bg-green-500 rounded-sm mt-0.5 ml-0.5"></div>
        </div>
        <div className="flex space-x-0.5">
          <div className="w-1 h-1 bg-black rounded-full opacity-80"></div>
          <div className="w-1 h-1 bg-black rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-black rounded-full opacity-40"></div>
          <div className="w-1 h-1 bg-black rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};
