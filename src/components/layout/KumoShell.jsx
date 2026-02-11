/**
 * [INPUT]: 依赖 react, @/components/layout/Header
 * [OUTPUT]: 对外提供 KumoShell 布局组件
 * [POS]: 布局组件，提供 Kumo 风格侧边栏与内容骨架
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Header } from "@/components/layout/Header"

const NAV_ITEMS = [
  { label: "Overview", href: "#top" },
  { label: "Types", href: "#types" },
  { label: "Customize", href: "#customize" },
  { label: "Setup", href: "#setup" },
  { label: "Design", href: "/design" },
]

export function KumoShell({ children }) {
  return (
    <div data-kumo-shell className="min-h-screen bg-kumo-base text-kumo-default">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-kumo-line bg-kumo-recessed lg:flex">
          <div className="sticky top-0 flex h-screen flex-col gap-6 px-6 py-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-kumo-subtle">
              JIKAN
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-kumo-subtle transition hover:bg-kumo-base hover:text-kumo-default"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <Header />
          <main className="flex-1" id="top">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
