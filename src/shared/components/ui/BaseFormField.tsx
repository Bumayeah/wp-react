interface BaseFormFieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  children?: React.ReactNode
}

export function BaseFormField({ id, label, error, required, optional, children }: BaseFormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1 dark:text-white">
        {label}
        {required && <span className="text-red-500" aria-hidden="true"> *</span>}
        {optional && <span className="text-muted text-xs"> (optioneel)</span>}
      </label>
      {children}
      {error && <p role="alert" className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
