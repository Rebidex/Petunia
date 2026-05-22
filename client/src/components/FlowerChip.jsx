const FlowerChip = ({ flower, quantity, onInc, onDec }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{flower.name}</p>
        <span className="text-sm font-bold text-pink-600 dark:text-pink-400">{flower.price} RON</span>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={onDec}
          className="rounded-md border border-slate-300 px-3 py-1 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          -
        </button>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{quantity}</span>
        <button
          onClick={onInc}
          className="rounded-md border border-slate-300 px-3 py-1 font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default FlowerChip
