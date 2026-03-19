export function useInputClass() {
  return (hasError: boolean) =>
    [
      'w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
      hasError ? 'border-red-500' : 'border-gray-300 dark:border-white/20',
    ].join(' ')
}
