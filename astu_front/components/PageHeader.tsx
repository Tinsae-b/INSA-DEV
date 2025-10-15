import { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  subtitle: string
  icon?: ReactNode
  background?: string
}

export default function PageHeader({ title, subtitle, icon, background = "bg-white border-b" }: PageHeaderProps) {
  return (
    <div className={background}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        </div>
        <p className="text-xl text-gray-600">{subtitle}</p>
      </div>
    </div>
  )
}











