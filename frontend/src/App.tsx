import { CTASection } from '@/landing/cta'
import { FeaturesSection } from '@/landing/features'
import { FooterSection } from '@/landing/footer'
import { HeroSection } from '@/landing/hero'
import { HowItWorksSection } from '@/landing/how-it-works'
import { LandingHeader } from '@/landing/header'
import { StatsSection } from '@/landing/stats'
import { TestimonialsSection } from '@/landing/testimonials'
import { DashboardPage } from '@/dashboard/page'
import { usePathname } from '@/lib/next-navigation'
import { ThemeProvider } from './theme-provider'

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  )
}

function App() {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {isDashboard ? <DashboardPage /> : <LandingPage />}
    </ThemeProvider>
  )
}

export default App
