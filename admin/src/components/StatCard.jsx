const StatCard = ({ title, value }) => {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </article>
  )
}

export default StatCard
