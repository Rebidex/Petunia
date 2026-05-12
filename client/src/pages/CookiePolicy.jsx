const CookiePolicy = () => {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Cookie Policy</h1>
      <p className="mb-4 text-slate-600">FloriShop foloseste cookie-uri pentru:</p>
      <ul className="list-disc space-y-2 pl-5 text-slate-600">
        <li>Autentificare (token JWT stocat in localStorage)</li>
        <li>Cos de cumparaturi (stocat in localStorage)</li>
        <li>Preferintele builderului de buchete (stocat in localStorage)</li>
      </ul>
      <p className="mt-4 text-slate-600">Nu folosim cookie-uri de tracking sau advertising third-party.</p>
    </div>
  )
}

export default CookiePolicy
