const Modal = ({ title, onClose, onSubmit, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            x
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          className="space-y-3"
        >
          {children}
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
