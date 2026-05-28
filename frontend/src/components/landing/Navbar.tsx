import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuContent,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

type MobileNavProps = {
    nav: {
        name: string
        items: {
            label: string
            href: string
        }[]
    }[]
}

export function MobileNav({ nav }: MobileNavProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'extend-touch-target block size-8 touch-manipulation items-center justify-start gap-2.5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent md:hidden dark:hover:bg-transparent'
                    )}
                >
                    <div className="relative flex items-center justify-center">
                        <div className="relative size-4">
                            <span
                                className={cn(
                                    'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                                    open ? 'top-[0.4rem] -rotate-45' : 'top-1'
                                )}
                            />
                            <span
                                className={cn(
                                    'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                                    open ? 'top-[0.4rem] rotate-45' : 'top-2.5'
                                )}
                            />
                        </div>
                        <span className="sr-only">Toggle Menu</span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="bg-background/95 no-scrollbar h-[calc(100vh-4rem)] w-screen overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
                align="start"
                side="bottom"
                alignOffset={-16}
                sideOffset={20}
            >
                <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
                    {nav.map((category, index) => (
                        <div className="flex flex-col gap-4" key={index}>
                            <p className="text-brand-orange text-sm font-bold uppercase tracking-widest">
                                {category.name}
                            </p>
                            <div className="flex flex-col gap-3">
                                {category.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.href}
                                        className="text-2xl font-medium text-brand-dark hover:text-brand-orange transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <Link to="/login" onClick={() => setOpen(false)} className="flex items-center justify-center w-full bg-brand-orange text-white rounded-full py-4 font-semibold text-lg hover:bg-orange-600 transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const productLinks = [
    { title: 'The Devise Engine', description: 'Core Platform Architecture', href: '/product/engine' },
    { title: 'Devise Oversight', description: 'AI Governance Intelligence', href: '/product/oversight' },
    { title: 'Devise Pulse', description: 'AI Adoption Intelligence', href: '/product/pulse' },
    { title: 'Devise Spend', description: 'AI Cost Intelligence', href: '/product/spend' },
]

const solutionsLinks = [
    { title: 'For Startups', description: "See your team's AI usage in 60 seconds.", href: '/solutions/startups' },
    { title: 'For Enterprise', description: 'Board-ready AI ROI in 90 days.', href: '/solutions/enterprise' },
]

const useCasesLinks = [
    { title: 'Org-wide AI adoption scoreboard', description: 'Featured Use Case', href: '/use-cases' },
    { title: 'Did your AI deployment actually work?', description: 'Featured Use Case', href: '/use-cases' },
    { title: 'Confidential data sent to ChatGPT', description: 'Featured Use Case', href: '/use-cases' },
    { title: 'Shadow AI spreading unchecked', description: 'Featured Use Case', href: '/use-cases' },
]

const resourcesLinks = [
    { title: 'Blog', description: 'Latest articles and insights', href: '/blog' },
    { title: 'Guides', description: 'Deep dive into AI governance', href: '/guides' },
    { title: 'White Papers', description: 'Industry research and reports', href: '/whitepapers' },
    { title: 'Events', description: 'Webinars and conferences', href: '/events' },
    { title: 'Compare', description: 'Devise vs alternatives', href: '/compare' },
]

const companyLinks = [
    { title: 'About', description: 'Our mission and team', href: '/about' },
    { title: 'Security', description: 'How we protect your data', href: '/security' },
    { title: 'Careers', description: 'Join us at Devise', href: '/careers' },
    { title: 'Contact', description: 'Get in touch with us', href: '/contact' },
]

const navigationLinks: {
    mobile: { name: string; items: { href: string; label: string }[] }[];
    desktop: {
        label: string;
        href?: string;
        active?: boolean;
        gridCols?: number;
        categories?: { name: string; id: string; items: { title: string; description: string; href: string }[] }[];
    }[];
} = {
    mobile: [
        {
            name: 'Product',
            items: productLinks.map(item => ({ href: item.href, label: item.title })),
        },
        {
            name: 'Solutions',
            items: solutionsLinks.map(item => ({ href: item.href, label: item.title })),
        },
        {
            name: 'Use Cases',
            items: useCasesLinks.map(item => ({ href: item.href, label: item.title })),
        },
        {
            name: 'Company',
            items: companyLinks.map(item => ({ href: item.href, label: item.title })),
        },
    ],
    desktop: [
        {
            label: 'Product',
            gridCols: 1,
            categories: [{ name: 'Core Engine', id: 'product', items: productLinks }],
        },
        {
            label: 'Solutions',
            gridCols: 1,
            categories: [{ name: 'By Company Size', id: 'solutions', items: solutionsLinks }],
        },
        {
            label: 'Use Cases',
            gridCols: 1,
            categories: [{ name: 'Featured Scenarios', id: 'usecases', items: useCasesLinks }],
        },
        {
            label: 'Resources',
            gridCols: 1,
            categories: [{ name: 'Learn & Compare', id: 'resources', items: resourcesLinks }],
        },
        {
            label: 'Company',
            gridCols: 1,
            categories: [{ name: 'About Devise', id: 'company', items: companyLinks }],
        },
    ],
}

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 md:px-8 flex justify-center pointer-events-none">
            <nav 
                className={cn(
                    "pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-500 flex items-center justify-between px-6 border",
                    isScrolled 
                        ? "bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-white/40 py-2.5" 
                        : "bg-white/95 backdrop-blur-xl shadow-lg border-white/50 py-3"
                )}
            >
                {/* LOGO */}
                <div className="flex items-center justify-start shrink-0">
                    <Link to="/" className="flex items-center group">
                        <img src="/logo.svg" alt="Devise Logo" className="h-7 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                        <span className="ml-2.5 text-lg font-bold text-[#0a0806] tracking-tight group-hover:text-[#f95001] transition-colors duration-300">Devise</span>
                    </Link>
                </div>

                {/* DESKTOP NAV */}
                <NavigationMenu className="max-md:hidden flex-1 justify-center" viewport={false}>
                    <NavigationMenuList className="gap-1">
                        {navigationLinks.desktop.map((link, index) => {
                            if (link.categories && link.categories?.length > 0) {
                                return (
                                    <NavigationMenuItem key={index} className="relative">
                                        <NavigationMenuTrigger className="h-9 rounded-full px-4 py-2 text-sm font-medium text-[#605e5c] bg-transparent hover:text-[#0a0806] hover:bg-white/60 hover:shadow-sm data-[state=open]:bg-white/60 data-[state=open]:text-[#0a0806] transition-all duration-300">
                                            {link.label}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent
                                            className={cn(
                                                'z-50 p-3 md:w-[400px] bg-white rounded-3xl border border-[#e5e4e2] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden',
                                                'md:absolute md:top-full md:mt-2',
                                                index > 2 ? 'md:right-0 md:left-auto' : 'md:left-0 md:right-auto',
                                                link.gridCols === 1 && 'columns-1 lg:w-[380px]',
                                                link.gridCols === 2 && 'columns-2 gap-6 lg:w-[640px]',
                                                link.gridCols === 3 && 'columns-3 gap-6 lg:w-[840px]',
                                                link.gridCols && link.gridCols > 3 && `columns-${link.gridCols} gap-6 lg:w-[840px]`
                                            )}
                                        >
                                            {link.categories.map((category) => (
                                                <div key={category.id} className="mb-2 break-inside-avoid">
                                                    <h3 className="text-[#a09e9c] mb-2 px-4 mt-2 text-[10px] uppercase font-mono font-bold tracking-widest">
                                                        {category.name}
                                                    </h3>
                                                    <ul className="grid gap-1">
                                                        {category.items.map((item) => (
                                                            <ListItem
                                                                key={item.title}
                                                                title={item.title}
                                                                href={item.href}
                                                            >
                                                                {item.description}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )
                            }

                            return (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuLink
                                        asChild
                                        data-active={link.active}
                                        className="h-9 rounded-full px-4 py-2 text-sm font-medium text-[#605e5c] bg-transparent hover:text-[#0a0806] hover:bg-white/60 hover:shadow-sm transition-all duration-300 inline-flex items-center"
                                    >
                                        <Link to={link.href || '#'}>{link.label}</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )
                        })}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center justify-end gap-3 shrink-0">
                    <Link
                        to="/demo"
                        className="hidden md:inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium text-[#605e5c] hover:text-[#0a0806] hover:bg-white/60 transition-all duration-300"
                    >
                        Book Demo
                    </Link>
                    <Link 
                        to="/login" 
                        className="hidden md:inline-flex items-center justify-center h-9 px-5 bg-[#0a0806] text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[#f95001] hover:shadow-[0_0_20px_rgba(249,80,1,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Get Started
                    </Link>
                    <div className="md:hidden">
                        <MobileNav nav={navigationLinks.mobile} />
                    </div>
                </div>
            </nav>
        </div>
    )
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<'a'> & { href: string }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link 
                    to={href}
                    className="block px-4 py-3 rounded-2xl hover:bg-[#f9f8f6] transition-all duration-300 focus:outline-none group"
                    {...props}
                >
                    <div className="text-[11px] font-mono font-bold text-[#0a0806] uppercase tracking-widest mb-1 group-hover:text-[#f95001] group-hover:translate-x-1 transition-all duration-300">
                        {title}
                    </div>
                    <p className="text-[#605e5c] line-clamp-2 text-xs font-light leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
