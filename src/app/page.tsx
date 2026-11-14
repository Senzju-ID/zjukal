import CardPost from '@/components/CardPost';

export default function Home() {
  return (
    <main>
      <header className="flex w-full pt-0 px-7 text-2xl"> 
         <div>
          <span className="font-bold tracking-tight ">Zjukal</span>
         </div>
      </header>
      <div>
        <CardPost title="rafa yuri" description="Description for rafa yuri" imgPath="/path/to/image1.jpg"/>
        <CardPost title="rafa nyawit"/>
        <CardPost title="rafa medan"/>
      </div>
    </main>
  );
}