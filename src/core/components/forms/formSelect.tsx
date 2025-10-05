import React, { JSX } from "react";

type Option = { label: string; value: string };

type FormSelectProps = {
    label: string | JSX.Element;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Option[];
    disabled?: boolean;
    error?: string | null;
};

const baseInputClass =
    "w-full border p-2 rounded-md text-sm appearance-none bg-white focus:outline-none";
const labelClass = "block text-sm font-medium mb-1 text-gray-600";

export const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    disabled = false,
    error = null, 
}: FormSelectProps) => {
    const dynamicTextColor = value === "" ? "text-gray-400" : "text-gray-700";

    const inputClass = `${baseInputClass} ${
        error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
    } ${dynamicTextColor}`;

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={inputClass}
                disabled={disabled}
            >
                <option value="" disabled hidden>
                    Pilih {typeof label === "string" ? label : "opsi"}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};
