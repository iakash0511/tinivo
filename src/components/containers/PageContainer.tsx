
function PageContainer({children}: {children: React.ReactNode}) {
  return (
    <main className="min-h-screen bg-light-bg px-4 py-12 flex justify-center items-center">
      <div className="max-w-2xl bg-white rounded-3xl shadow-md p-8 w-full space-y-8">
        {children}
        </div>
    </main>
  )
}

export default PageContainer