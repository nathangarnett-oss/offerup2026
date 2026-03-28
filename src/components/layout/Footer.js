import { Link } from 'react-router-dom';

const linkColumns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse', to: '/browse' },
      { label: 'Categories', to: '/browse?view=categories' },
      { label: 'Deals', to: '/browse?sort=deals' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { label: 'Post Item', to: '/sell' },
      { label: 'Business Tools', to: '/business' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Safety', to: '/safety' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-lg
                 bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400
                 hover:bg-primary-100 hover:text-primary-600
                 dark:hover:bg-primary-900/40 dark:hover:text-primary-400
                 transition-colors"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo & tagline */}
          <div className="col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold text-gradient">NearbyFinds</span>
            </Link>
            <p className="mt-3 text-sm text-surface-500 dark:text-surface-400 max-w-xs leading-relaxed">
              Your trusted local marketplace. Buy, sell, and discover amazing deals in your neighborhood.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-2">
              <SocialIcon href="https://twitter.com" label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.044 1.545.108v3.281a8 8 0 0 0-.87-.044c-1.236 0-1.715.468-1.715 1.685v2.528h2.449l-.42 3.667h-2.03v8.146A10.7 10.7 0 0 0 12 24c-.343 0-.682-.016-1.018-.046a10.5 10.5 0 0 1-1.88-.263z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com" label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Link columns */}
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-surface-500 dark:text-surface-400
                                 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-surface-200 dark:border-surface-800
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-400 dark:text-surface-500">
            &copy; {new Date().getFullYear()} NearbyFinds. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-surface-400 dark:text-surface-500">
            <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Terms
            </Link>
            <Link to="/accessibility" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
