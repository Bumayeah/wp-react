const dateFmt = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
const dateFmtShort = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' })
const dateFmtFull = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const currencyFmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })

export function useFormatting() {
  function formatDate(iso: string): string {
    return dateFmt.format(new Date(iso))
  }

  function formatDateShort(iso: string): string {
    return dateFmtShort.format(new Date(iso))
  }

  function formatDateFull(iso: string): string {
    return dateFmtFull.format(new Date(iso))
  }

  function formatDateRange(from: string, to: string): string {
    const start = new Date(from)
    const end = new Date(to)
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const month = new Intl.DateTimeFormat('nl-NL', { month: 'long' }).format(start)
      const year = start.getFullYear()
      return `${start.getDate()}–${end.getDate()} ${month} ${year}`
    }
    return `${formatDateShort(from)} – ${formatDate(to)}`
  }

  function formatCurrency(amount: number): string {
    return currencyFmt.format(amount)
  }

  return { formatDate, formatDateShort, formatDateFull, formatDateRange, formatCurrency }
}
