type FormInputProps = {
    label: string | JSX.Element
    name: string
    value: string | number
    type?: string
    placeholder?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    required?: boolean
    icon?: React.ReactNode
    disabled?: boolean
    className?: string
    textarea?: boolean
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
    required = false,
    icon,
    disabled = false,
    className = "",
    textarea = false
}: FormInputProps) => (
    <div>
        <label className={labelClass}>
            {label}
        </label>
        <div className="relative flex items-center">
            {icon && (
                <div className="absolute left-3">
                    {icon}
                </div>
            )}
            {textarea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${inputClass} ${icon ? "pl-10" : ""} ${className}`}
                />
            ) : (
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`${inputClass} ${icon ? "pl-10" : ""} ${className}`}
                />
            )}
        </div>
    </div>
);
