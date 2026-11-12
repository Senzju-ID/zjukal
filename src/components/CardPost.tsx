
interface CardPostProps {
    title: string;
    description?: string;
    imgPath?: string;
}

const CardPost = ({title, description, imgPath }: CardPostProps) => {
    return (
        <div className="flex flex-col w-40 h-15 bg-blue-400/100 rounded-lg shadow-md p-4">
            <h1>{title}</h1>
        </div>
    )
}

export default CardPost; 