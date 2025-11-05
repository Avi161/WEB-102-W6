import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DogInfo = ({ id, name, breed, life_span }) => {
    return (
        <div className="dog-info">
            <h2>🐶 {name}</h2>
            <h4>🐕 breed: {breed || "Unknown"}</h4>
            <h4>👶➡️👩➡️👵 {life_span}</h4>
            <Link to={`/dogs/${id}`}>View Details →</Link>
        </div>
    )
}

export default DogInfo