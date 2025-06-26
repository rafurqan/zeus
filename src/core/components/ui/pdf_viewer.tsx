import React from 'react';

type PDFSource = { type: 'url'; value: string } | { type: 'base64'; value: string };

interface PDFPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    source: PDFSource;
    title?: string;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
    isOpen,
    onClose,
    source,
    title = "Pratinjau Dokumen",
}) => {
    if (!isOpen) {
        return null;
    }

    let pdfDataUrl = '';
    let rawBase64 = '';

    if (source.type === 'url') {
        pdfDataUrl = `${source.value}#view=FitW`;
    } else {
        rawBase64 = source.value;
        const base64Prefix = 'data:application/pdf;base64,';

        if (rawBase64.startsWith(base64Prefix)) {
            console.warn("Sumber Base64 sudah mengandung prefix Data URI.");
            pdfDataUrl = rawBase64;
        } else {
            pdfDataUrl = `${base64Prefix}${rawBase64}`;
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div
                className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
                        aria-label="Tutup"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-grow bg-gray-50">
                    <object
                        data={pdfDataUrl}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                        className="rounded-b-lg"
                    >
                        <div className="p-4 text-center">
                            Gagal memuat pratinjau PDF. File mungkin rusak atau tidak didukung.
                        </div>
                    </object>
                </div>
            </div>
        </div>
    );
};

export default PDFPreviewModal;