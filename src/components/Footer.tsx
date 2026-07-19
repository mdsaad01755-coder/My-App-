import { AtSign, MessageCircle, Send } from "lucide-react";

const linkColumns = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Integrations", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "Support", "API Reference", "Community"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security"],
  },
];

const socialLinks = [
  { icon: AtSign, label: "X (Twitter)" },
  { icon: MessageCircle, label: "Discord" },
  { icon: Send, label: "Newsletter" },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-border bg-panel px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <span className="font-display text-lg font-semibold tracking-[-0.02em] text-text">
              Nimbus
            </span>
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted">
              One fast, focused workspace for teams who&apos;d rather build
              than switch tabs.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors duration-300 hover:border-violet/50 hover:text-violet"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkColumns.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text">
                {heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors duration-300 hover:text-text"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Nimbus. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built with care for teams who ship.
          </p>
        </div>
      </div>
    </footer>
  );
}
