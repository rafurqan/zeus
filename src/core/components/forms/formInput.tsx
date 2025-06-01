import { JSX } from "react"

type FormInputProps = {
    label: string | JSX.Element
    name: string
    value: string | number
    type?: string
    placeholder?: string
    disabled?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void // Tipe yang lebih fleksibel
}

const inputClass = "w-full border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded-md text-sm appearance-none bg-white";
const labelClass = "block text-sm font-medium mb-1 text-gray-700";

export const FormInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false
}: FormInputProps) => (
    <div>
        <label className={labelClass}>{label}</label>
        <input
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={inputClass}
            disabled={disabled}
        />
    </div>
);
