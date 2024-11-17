import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function GoogleRedirect() {
    const [searchParams] = useSearchParams();
    const navigate  = useNavigate();
    useEffect(() => {
        const code = searchParams.get('code');
        console.log(code)
        if (code) {
            const googleRedirect = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/oauth2callback`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem("googleSync",1);
                        console.log('Successfully exchanged code for token:', data);
                        navigate("/calendar");
                        // You can save the tokens in local storage, context, or state
                    } else {
                        localStorage.removeItem("googleSync");
                        console.error('Error exchanging code for token:', data);
                    }
                } catch (error) {
                    console.error('Error in fetching token:', error);
                }
            };
           googleRedirect();
        }
    }, [searchParams]);
  return (
    <div>
      Loading...
    </div>
  )
}

export default GoogleRedirect
