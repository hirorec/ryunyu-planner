interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // バッジなど追加要素
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="gradient-header px-5 pb-5 pt-8 text-white">
      {subtitle && <p className="mb-1 text-sm text-green-100">{subtitle}</p>}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {children && <div className="mt-3">{children}</div>}
    </header>
  );
}
