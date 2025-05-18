import { useState } from "react";

export type ConfirmOptions = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
};

let externalResolve: (value: boolean) => void;

export function useConfirm() {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    const confirm = (options: ConfirmOptions) => {
        setOptions(options);
        return new Promise<boolean>((resolve) => {
            externalResolve = resolve;
        });
    };

    const handleConfirm = (result: boolean) => {
        externalResolve(result);
        setOptions(null);
    };

    const ConfirmDialog = options ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-30">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">{options.title || "Konfirmasi"}</h2>
                <p className="text-gray-700 mb-6">{options.message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => handleConfirm(false)}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        {options.cancelText || "Batal"}
                    </button>
                    <button
                        onClick={() => handleConfirm(true)}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {options.confirmText || "Ya"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return { confirm, ConfirmDialog };
}
