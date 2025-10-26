import { useState, useEffect} from "react";

const DogInfo = ({index, name, breed, life_span}) => {
    return (
        <div key={index} className="dog-info">
            <h2>🐶 {name}</h2>
            <h4>🐕 breed: {breed}</h4>
            <h4>👶➡️👩➡️👵 {life_span}</h4>
        </div>
    )
}

export default DogInfo