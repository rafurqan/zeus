import { ReactNode, useState } from "react";

type ConfirmContentProps<T> = {
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
};

export type ConfirmOptions<T> = {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    content?: ReactNode | ((props: ConfirmContentProps<T>) => ReactNode);
};

let externalResolve: (<T>(value: false | T) => void) | null = null;

export function useConfirm<T extends object = Record<string, unknown>>() {
    const [options, setOptions] = useState<ConfirmOptions<T> | null>(null);
    const [formData, setFormData] = useState<T>({} as T);

    const confirm = (options: ConfirmOptions<T>): Promise<T | false> => {
        setOptions(options);
        setFormData({} as T);
        return new Promise<T | false>((resolve) => {
            externalResolve = resolve as unknown as <T>(value: false | T) => void;
        });
    };

    const handleConfirm = (result: boolean) => {
        if (externalResolve) {
            externalResolve(result ? formData : false);
            externalResolve = null;
        }
        setOptions(null);
    };

    const ConfirmDialog = options ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">
                    {options.title || "Konfirmasi"}
                </h2>
                <p className="text-gray-700 mb-4">{options.message}</p>

                {options.content && (
                    <div className="mb-4">
                        {typeof options.content === "function"
                            ? options.content({ formData, setFormData })
                            : options.content}
                    </div>
                )}

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
