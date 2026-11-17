import SearchBar from '@/components/SearchBar';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import { Spool } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex w-full pt-4 px-7 justify-between items-center gap-4"> 
           <div className="flex items-center gap-4 shrink-0">
            <div className="w-9 h-9 rounded-full bg-ui/50 flex items-center justify-center shrink-0 border border-ui-border shadow-sm">
              <Spool size={18} className="text-color-primary" />
            </div> 
            <span className="font-bold tracking-tight text-2xl">Zjukal</span>
           </div>
           <div className="flex items-center gap-1.5 flex-1 justify-end max-w-md">
            <ThemeSwitch sizeIcon={18} border={false} className="p-2 bg-surface/40 backdrop-blur-md border border-ui-border rounded-xl shadow-lg hover:bg-ui/50 transition-all duration-300" />
            <SearchBar />
           </div>
        </header>
    );
};

export default Header;
