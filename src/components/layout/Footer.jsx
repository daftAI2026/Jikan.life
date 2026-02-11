/**
 * [INPUT]: 依赖 @phosphor-icons/react (图标), @/components/ui/separator
 * [OUTPUT]: 对外提供 Footer 组件
 * [POS]: 布局组件，包含版权和底部信息
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Separator } from "@/components/ui/separator"
import { Heart } from "@phosphor-icons/react"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-12">
            <div className="container px-4">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold tracking-tight">JIKAN</h3>
                        <p className="text-sm text-muted-foreground">
                            人生不只是格子，动态墙纸生成器。
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Built with</span>
                        <Heart className="h-4 w-4 fill-primary text-primary" />
                        <span>by Antigravity</span>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} JIKAN. Apache-2.0 Licensed.
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <a href="#" className="hover:underline underline-offset-4">Privacy Policy</a>
                        <a href="#" className="hover:underline underline-offset-4">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
