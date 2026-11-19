const SearchBar = () => {
    return (
        <div className="relative flex items-center group max-w-50 sm:max-w-xs w-full ml-4">
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-surface/40 backdrop-blur-md border border-ui-border rounded-2xl py-2 px-4 outline-none focus:border-accent w-full transition-all duration-300 shadow-lg text-sm placeholder:text-color-secondary"
            />
        </div>
    );
};

export default SearchBar;
