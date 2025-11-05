import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const DogDetail = () => {
    const { id } = useParams();
    const [dog, setDog] = useState(null);

    useEffect(() => {
    const fetchDog = async () => {
        const res = await fetch(`https://api.thedogapi.com/v1/breeds/${id}`);
        const data = await res.json();
        setDog(data);
    };
    fetchDog();
    }, [id]);

    if (!dog) return <p>Loading...</p>;

    return (
    <div className="dog-detail">
        <h2>{dog.name}</h2>
        <p><b>Group:</b> {dog.breed_group}</p>
        <p><b>Lifespan:</b> {dog.life_span}</p>
        <p><b>Temperament:</b> {dog.temperament}</p>
        <img src={dog.image?.url} alt={dog.name} />
    </div>
    );
}

export default DogDetail;