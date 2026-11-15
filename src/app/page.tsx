import CardThread from '@/components/CardThread';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <header className="flex w-full pt-4 px-7 justify-between items-center"> 
         <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-ui/50 shrink-0" /> 
          <span className="font-bold tracking-tight text-2xl">Zjukal</span>
         </div>
         <SearchBar />
      </header>
      
      <div className="px-7 mt-6">
        <h2 className="text-sm font-semibold text-color-secondary tracking-wider">Newest Threads</h2>
      </div>

      <div className="flex flex-col gap-4 mt-2 px-5">
        <CardThread 
          id="1"
          title="rafa yuri" 
          description="rafa yuri adalah seorang programmer yang sangat berbakat dan memiliki pengalaman luas dalam pengembangan web dan aplikasi mobile. Dia dikenal karena kemampuannya dalam menyelesaikan masalah kompleks dengan solusi yang elegan dan efisien. Selain itu, rafa yuri juga aktif berkontribusi pada komunitas open source dan sering membagikan pengetahuannya melalui blog dan workshop." 
          imgPath="/upload/nozomi_02.png"
        />
        <CardThread id="2" title="rafa nyawit"/>
        <CardThread id="3" title="rafa medan"/>
      </div>

      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-13 bg-surface border border-ui-border rounded-4xl shadow-2xl flex items-center justify-around px-6">
      </footer>
    </main>
  );
}
