const CookiePolicy = () => {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 animate-page">
      <h1 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Politica de cookie-uri</h1>
      <p className="mb-4 text-slate-600 dark:text-slate-300">Petunia foloseste cookie-uri pentru:</p>
      <ul className="list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">
        <li>Autentificare (token JWT stocat in localStorage)</li>
        <li>Cos de cumparaturi (stocat in localStorage)</li>
        <li>Preferintele builderului de buchete (stocat in localStorage)</li>
      </ul>
      <p className="mt-4 text-slate-600 dark:text-slate-350">Nu folosim cookie-uri de tracking sau publicitate terte.</p>
    </div>
  )
}

export default CookiePolicy
