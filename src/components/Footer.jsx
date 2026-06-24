import Link from "next/link";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-tasks", label: "Browse Tasks" },
  { href: "/browse-freelancers", label: "Browse Freelancers" },
  { href: "/auth/signin", label: "Login" },
];

const socialLinks = [
  {
    href: "https://x.com",
    label: "X",
    icon: FaXTwitter,
  },
  {
    href: "https://www.instagram.com",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    href: "https://www.linkedin.com",
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500 font-black text-white shadow-lg shadow-sky-500/20">
                S
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">
                  SkillSwap
                </h2>
                <p className="text-sm text-slate-400">
                  Freelance micro-task marketplace
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Connect clients and freelancers for fast, reliable task delivery with a polished and secure experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-200 transition hover:border-sky-400 hover:bg-sky-500 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-sky-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>Email: hello@skillswap.com</p>
              <p>WhatsApp: +880 1885 373186</p>
              <p>Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="transition hover:text-sky-400">
              Home
            </Link>
            <Link href="/auth/signin" className="transition hover:text-sky-400">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
