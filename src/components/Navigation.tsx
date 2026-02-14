import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, ChevronDown, LayoutDashboard, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { CurrencyPicker } from "./CurrencyPicker";
import { LoginModal } from "./LoginModal";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Home", to: "/", type: "route" as const },
  { name: "Destinations", to: "/destinations", type: "route" as const },
  { name: "Services", to: "/services", type: "route" as const },
  { name: "Testimonials", to: "/testimonials", type: "route" as const },
  { name: "Blog", to: "/blog", type: "route" as const },
  { name: "Contact", to: "/contact", type: "route" as const },
];

const getFirstName = (fullName: string): string => {
  return fullName.trim().split(/\s+/)[0] || fullName;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrencyWithRegion } = useCurrency();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 text-white shadow-lg">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Logo */}
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 min-w-0 no-underline">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fde743b16560c4ea5a4a46e65a2543876%2F4be0568d99d2469baa7ef6c274a8a1b2?format=webp&width=800" alt="StoriesByFoot logo" className="h-9 w-auto sm:h-10" />
            <span className="text-base sm:text-lg md:text-xl font-bold leading-tight text-white">
              StoriesBy<span className="text-secondary">Foot</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center lg:space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              const classes = "text-white/90 hover:text-white transition-colors font-medium relative group text-sm lg:text-base";

              if (item.type === "route") {
                return (
                  <Link key={item.name} to={item.to} className={classes}>
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              }

              return (
                <a key={item.name} href={item.to} className={classes}>
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              );
            })}
          </div>

          {/* Currency + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <CurrencyPicker value={currency} onChange={setCurrencyWithRegion} />
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Hi, {getFirstName(user.fullName)}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/20 rounded-lg shadow-xl py-2 z-[100]">
                    <Link
                      to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                      className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {isAdmin ? "Admin Dashboard" : "Dashboard"}
                    </Link>
                    <Link
                      to="/support"
                      className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Support & FAQ
                    </Link>
                    <hr className="border-white/10 my-2" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-white/90 hover:text-white font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 border border-white/10 backdrop-blur-lg rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => {
                const classes = "block px-3 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors";

                if (item.type === "route") {
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      className={classes}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.name}
                    href={item.to}
                    className={classes}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                );
              })}
              <div className="px-3 py-2 flex items-center gap-2">
                <CurrencyPicker value={currency} onChange={setCurrencyWithRegion} className="flex-1" />
                {isAuthenticated && user ? (
                  <>
                    <div className="text-white/90 text-sm font-medium px-2 py-1">
                      Hi, {getFirstName(user.fullName)}
                    </div>
                    <Link
                      to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                      className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {isAdmin ? "Admin Dashboard" : "Dashboard"}
                    </Link>
                    <Link
                      to="/support"
                      className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
                      Support & FAQ
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex-none px-4 py-2 rounded-md bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default Navigation;
