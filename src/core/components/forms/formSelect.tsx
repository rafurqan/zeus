// FormSelect.tsx
type Option = { label: string; value: string }

type FormSelectProps = {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: Option[],
    disabled?: boolean
}
const inputClass = "w-full border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded-md text-sm appearance-none bg-white";
const labelClass = "block text-sm font-medium mb-1 text-gray-700";
export const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    disabled = false
}: FormSelectProps) => (
    <div>
        <label className={labelClass}>{label}</label>
        <select name={name} value={value} onChange={onChange} className={inputClass} disabled={disabled}>
            <option value="">Pilih</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
)
