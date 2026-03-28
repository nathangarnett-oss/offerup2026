import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/browse', label: 'Search', icon: Search },
  { to: '/sell', label: 'Sell', icon: PlusCircle, isSell: true },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl
                 border-t border-surface-200 dark:border-surface-800
                 safe-area-bottom"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, label, icon: Icon, isSell, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1
               transition-colors ${
                 isSell
                   ? ''
                   : isActive
                   ? 'text-primary-600 dark:text-primary-400'
                   : 'text-surface-400 dark:text-surface-500'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator dot */}
                {isActive && !isSell && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5
                                   bg-primary-600 dark:bg-primary-400 rounded-full" />
                )}

                {isSell ? (
                  <span className="flex items-center justify-center w-12 h-12 -mt-5
                                   rounded-full bg-gradient-to-br from-primary-500 to-accent-500
                                   text-white shadow-lg shadow-primary-500/30
                                   active:scale-95 transition-transform">
                    <Icon className="w-6 h-6" />
                  </span>
                ) : (
                  <Icon className="w-5 h-5" />
                )}

                <span className={`text-[10px] font-medium ${isSell ? '-mt-0.5' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Safe area spacer for devices with home indicator */}
      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </nav>
  );
}
