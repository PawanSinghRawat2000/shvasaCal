import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Protected({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem("user")) {
            setIsLoading(false);
        } else navigate("/login");
    }, [])
    if (isLoading) return <div>Loading...</div>
    return children;
}

export default Protected
