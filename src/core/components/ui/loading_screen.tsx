
const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-black font-semibold">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
