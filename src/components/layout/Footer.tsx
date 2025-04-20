import Link from "next/link";
import { DATA_SOURCES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Chennai Climate Tracer & Predictor</h3>
            <p className="text-sm text-muted-foreground">
              Real-time climate tracking and future predictions for Chennai using GAWS datasets.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/historical" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Historical Trends
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Predictions
                </Link>
              </li>
              <li>
                <Link href="/maps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Maps
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Alerts & Notifications
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Data Sources</h3>
            <ul className="space-y-2">
              {DATA_SOURCES.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Chennai Climate Tracer & Predictor. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
