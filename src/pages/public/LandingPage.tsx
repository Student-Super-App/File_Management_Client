import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileBox,
  Upload,
  Zap,
  Shield,
  Code,
  Globe,
  ArrowRight,
} from "lucide-react";

// ============================================
// LANDING PAGE
// ============================================

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              File Management for{" "}
              <span className="text-primary">Modern Developers</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload, transform, optimize, and deliver files at scale. A
              developer-first file management service with powerful APIs and
              SDKs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/docs">
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="mt-2 text-muted-foreground">
              Powerful features for managing files at scale
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 w-fit">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Uploads</h3>
              <p className="text-muted-foreground">
                Upload files directly from your app or via our API. Support for
                all file types with automatic validation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 w-fit">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Global CDN ensures your files are delivered quickly to users
                anywhere in the world.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 w-fit">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Storage</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with encryption at rest and in
                transit. SOC 2 compliant.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 w-fit">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Developer First</h3>
              <p className="text-muted-foreground">
                Clean APIs, comprehensive SDKs, and detailed documentation to
                get you up and running fast.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 w-fit">
                <FileBox className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Transformations</h3>
              <p className="text-muted-foreground">
                On-the-fly image resizing, format conversion, and optimization.
                Save storage and bandwidth.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <div className="rounded-full bg-primary/10 p-3 w-fit">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Global Scale</h3>
              <p className="text-muted-foreground">
                Built to handle billions of files. Auto-scaling infrastructure
                that grows with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border bg-card p-12 text-center">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mt-2 text-muted-foreground">
              Start for free, no credit card required.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
