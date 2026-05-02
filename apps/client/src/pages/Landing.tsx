import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-2">
                <Zap className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">SaaS Starter</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link to="/auth/register">
                <Button size="sm" className="font-medium rounded-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8">
                Build your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">big idea</span> faster than ever.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
                A complete, production-ready SaaS starter kit that handles authentication, teams, billing, and everything else you need to launch today instead of next month.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/auth/register">
                  <Button size="lg" className="h-12 px-8 rounded-full text-base font-semibold w-full sm:w-auto shadow-lg shadow-primary/20">
                    Start Building for Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base font-semibold w-full sm:w-auto">
                    View Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Everything you need to scale</h2>
              <p className="mt-4 text-lg text-muted-foreground">Stop reinventing the wheel. Focus on your core product instead.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Bulletproof Auth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Secure login, registration, email verification, and password resets ready to go out of the box.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                  <BarChart3 className="text-indigo-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Multi-Tenant Teams</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Let your users invite their colleagues, manage workspaces, and switch between multiple organizations seamlessly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Zap className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Modern Tech Stack</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built with the latest stack. Fast, scalable, and developer-friendly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Zap className="text-muted-foreground w-5 h-5 mr-2" />
            <span className="font-semibold text-muted-foreground">SaaS Starter &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
