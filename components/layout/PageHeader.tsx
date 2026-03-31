interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode  // バッジなど追加要素
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="gradient-header px-5 pt-8 pb-5 text-white">
      {subtitle && (
        <p className="text-sm text-green-100 mb-1">{subtitle}</p>
      )}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}
