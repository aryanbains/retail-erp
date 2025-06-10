import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { 
  Package, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default async function HomePage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Retail ERP</h1>
            </div>
            <div className="flex items-center gap-4">
              {userId ? (
                <>
                  <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-24">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-4">
              Trusted by 1,000+ retail businesses
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Modern ERP for Retail Business
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
              Streamline your inventory, sales, and operations with our comprehensive ERP solution. 
              Built for modern retailers who want to scale efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {!userId ? (
                <>
                  <Link href="/sign-up">
                    <Button size="lg">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold tracking-tight">
              Everything you need to run your retail business
            </h3>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              From inventory management to customer insights, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-y bg-muted/50">
          <div className="container mx-auto px-4 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-8">
                  Why choose Retail ERP?
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">
                    Ready to transform your business?
                  </CardTitle>
                  <CardDescription>
                    Join thousands of retailers who trust our platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {!userId && (
                    <Link href="/sign-up">
                      <Button size="lg" className="w-full">
                        Start Your Free Trial
                      </Button>
                    </Link>
                  )}
                  <p className="text-sm text-muted-foreground mt-4">
                    No credit card required • 14-day free trial
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="text-center py-12">
              <h3 className="text-3xl font-bold mb-4">
                Start growing your retail business today
              </h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Get instant access to all features. No setup fees.
              </p>
              {!userId && (
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">Retail ERP</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The modern solution for retail business management
                </p>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Product</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Company</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-4">Support</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-foreground transition-colors">Status</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
              © 2024 Retail ERP. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

const features = [
  {
    icon: Package,
    title: 'Inventory Management',
    description: 'Track stock levels, manage suppliers, and automate reordering with real-time insights.'
  },
  {
    icon: ShoppingCart,
    title: 'Point of Sale',
    description: 'Process sales quickly with our intuitive POS system that works online and offline.'
  },
  {
    icon: Users,
    title: 'Customer Management',
    description: 'Build lasting relationships with CRM tools and loyalty programs.'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Make data-driven decisions with comprehensive reporting and analytics.'
  },
  {
    icon: TrendingUp,
    title: 'Sales Forecasting',
    description: 'Predict trends and optimize inventory with AI-powered forecasting.'
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Automate repetitive tasks and focus on growing your business.'
  }
]

const benefits = [
  'Reduce operational costs by up to 30%',
  'Increase sales with better inventory management',
  'Save 10+ hours per week on manual tasks',
  'Get real-time insights across all locations',
  'Scale your business without scaling complexity',
  'Integrate with your existing tools seamlessly'
]