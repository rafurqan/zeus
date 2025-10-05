import { JSX } from "react"

type FormInputProps = {
    label: string | JSX.Element
    name?: string
    value: string | number | null
    type?: string
    placeholder?: string
    disabled?: boolean
    onlyLetters?: boolean
    onlyNumbers?: boolean
    error?: string | null
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void
}

const baseInputClass =
    "w-full border p-2 rounded-md text-sm appearance-none bg-white focus:outline-none"
const labelClass = "block text-sm font-medium mb-1 text-gray-700"

function toCamelCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9 ]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word, i) =>
            i === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("")
}

export const FormInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
    onlyLetters = false,
    onlyNumbers = false,
    error = null, // ✅ prop baru
}: FormInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === "camelcase") {
            const camel = toCamelCase(e.target.value)
            const event = {
                ...e,
                target: {
                    ...e.target,
                    value: camel,
                },
            }
            onChange(event as React.ChangeEvent<HTMLInputElement>)
        } else {
            const val = e.target.value

            if (onlyLetters) {
                if (/^[a-zA-Z\s]*$/.test(val)) {
                    onChange(e)
                }
                return
            }

            if (onlyNumbers) {
                if (/^\d*$/.test(val)) {
                    onChange(e)
                }
                return
            }

            onChange(e)
        }
    }

    const inputClass = `${baseInputClass} ${error
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-blue-500"
        }`

    return (
        <div>
            <label className={labelClass}>{label}</label>
            <input
                name={name ?? ""}
                value={value ?? ""}
                onChange={handleChange}
                type={type === "camelcase" ? "text" : type}
                placeholder={placeholder}
                className={inputClass}
                disabled={disabled}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    )
}
