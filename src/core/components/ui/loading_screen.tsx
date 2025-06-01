
const LoadingOverlay = () => {
    return (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-[9999]"> {/* Menggunakan z-index yang sangat tinggi */}
            <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-black font-semibold">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;