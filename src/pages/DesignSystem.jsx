/**
 * [INPUT]: 依赖 @/components/ui (Button, Card, Badge, Input, Label, Switch, Progress, Separator)
 * [OUTPUT]: 对外提供 DesignSystem 展示组件
 * [POS]: 用于开发调试和规范验证的页面，展示当前 UI 设计语言
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function DesignSystem() {
    return (
        <div className="container py-20 space-y-16">
            <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight">Design System</h1>
                <p className="text-xl text-muted-foreground">
                    基于 shadcn/ui + Amethyst Haze 主题，遵循微拟物光影设计语言。
                </p>
            </div>

            <Separator />

            {/* ======================================== 
          微拟物设计语言展示
          ======================================== */}
            <section className="space-y-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">✨ 微拟物设计语言</h2>
                    <p className="text-muted-foreground">
                        渐变背景 + 立体阴影 + 微交互 = 高级质感
                    </p>
                </div>

                {/* Buttons - 全变体展示 */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Buttons (立体渐变)</h3>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="default">Default</Button>
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="accent">Accent</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                        <Button size="xl">Extra Large</Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button isLoading>Loading...</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </div>

                <Separator />

                {/* Cards - 三变体展示 */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Cards (凸起/内凹/平面)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle>Elevated 凸起</CardTitle>
                                <CardDescription>外投影 + 顶部高光</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-primary">82%</div>
                            </CardContent>
                        </Card>
                        <Card variant="inset">
                            <CardHeader>
                                <CardTitle>Inset 内凹</CardTitle>
                                <CardDescription>内投影效果</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-muted-foreground">--</div>
                            </CardContent>
                        </Card>
                        <Card variant="flat">
                            <CardHeader>
                                <CardTitle>Flat 平面</CardTitle>
                                <CardDescription>极简阴影</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">OK</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Separator />

                {/* Badges - 渐变变体展示 */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Badges (渐变背景)</h3>
                    <div className="flex flex-wrap gap-3">
                        <Badge variant="default">Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="gradient">Gradient</Badge>
                    </div>
                </div>

                <Separator />

                {/* Input - 内凹效果 */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Input (内凹效果)</h3>
                    <div className="max-w-sm space-y-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input placeholder="linus@kernel.org" />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" placeholder="••••••••" />
                        </div>
                        <div className="space-y-2">
                            <Label>Disabled</Label>
                            <Input disabled placeholder="不可编辑" />
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* ======================================== 
          原有设计系统展示
          ======================================== */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Colors & Theme</h2>
                    <div className="grid grid-cols-5 gap-2">
                        {["bg-primary", "bg-secondary", "bg-accent", "bg-destructive", "bg-muted"].map((c) => (
                            <div key={c} className="space-y-2 text-center">
                                <div className={`aspect-square rounded-xl ${c}`} />
                                <span className="text-[10px] mono uppercase opacity-50">{c.split('-')[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Typography</h2>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black">Heading 1 Black</h1>
                        <h2 className="text-3xl font-bold">Heading 2 Bold</h2>
                        <h3 className="text-2xl font-semibold">Heading 3 Semibold</h3>
                        <p className="text-base leading-relaxed">
                            这是一段正文，展示字间距、行高和可读性。
                        </p>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Interactive */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Forms & Fields</h2>
                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center space-x-2">
                            <Switch id="airplane-mode" />
                            <Label htmlFor="airplane-mode">Airplane Mode</Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Feedback</h2>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <Label>Loading Progress</Label>
                                <span className="text-muted-foreground">67%</span>
                            </div>
                            <Progress value={67} className="h-2" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
