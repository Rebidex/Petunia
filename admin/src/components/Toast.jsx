import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const styles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800'
  }
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-slide-in ${styles[type]}`}
    >
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
