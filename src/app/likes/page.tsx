"use client"
import { useState } from "react";
const LikePage = () => {
    const [name, setName] = useState('ABC')
    return (
        <>
            <div
                onClick={() => setName("PhungAnhVan")}
            >Likes with {name}</div>    
        </>
    )
}
export default LikePage;