import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white text-xs font-bold">PT</span>
              </div>
              <span className="font-display font-semibold text-text-primary">
                PropTruth
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
              AI-powered property condition intelligence. Anchored on blockchain. Built for Indian renters.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <p className="text-text-primary text-sm font-medium">Product</p>
              <Link href="/" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
                Search property
              </Link>
              <Link href="/report/submit" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
                Submit report
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-text-primary text-sm font-medium">Verify</p>
              
                <a href="https://sepolia.etherscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary text-sm hover:text-text-primary transition-colors">
                Etherscan
              </a>
              
                <a href="https://gateway.pinata.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary text-sm hover:text-text-primary transition-colors"
              >
                IPFS Gateway
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-4">
          <p className="text-text-muted text-xs">
            © 2025 PropTruth. Built for transparency.
          </p>
          <p className="text-text-muted text-xs font-mono">
            Contract: 0x2e12...5236
          </p>
        </div>
      </div>
    </footer>
  )
}