import { Search, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">✈</span>
          </div>
          <span className="text-xl font-bold text-primary">thrillophilia</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for Dubai"
              className="w-full pl-12 pr-4 py-2.5 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xl">🇮🇳</span>
            <span className="font-semibold text-foreground text-sm">INR ₹</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
          </div>
          <button className="font-semibold text-foreground hover:text-primary transition-colors text-sm">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
