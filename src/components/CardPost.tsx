
interface CardPostProps {
    title: string;
    description?: string;
    imgPath?: string;
}

const CardPost = ({ title, description, imgPath }: CardPostProps) => {
    return (
        <div className="flex flex-col w-full bg-surface rounded-2xl shadow-sm p-5 border border-ui-border hover:border-accent transition-all duration-300 group cursor-pointer">
            <h1 className="text-xl font-bold transition-colors">
                {title}
            </h1>
            
            {description && (
                <p className="text-color-secondary text-sm mt-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {description}
                </p>
            )}

            {imgPath && (
                <div className="overflow-hidden rounded-xl mt-4">
                    <img 
                        src={imgPath} 
                        alt={title} 
                        className="w-full h-48 object-cover transition-transform duration-500"
                    />
                </div>
            )}
        </div>
    )
}

export default CardPost; 