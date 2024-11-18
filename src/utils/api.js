export const postData = async (path, data) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/${path}`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        if (!response.ok) {
            return { error: result.message };
        }
        return result;
    } catch (error) {
        return { error: "Something went wrong" };
    }
};

export const getData = async (path) => {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/${path}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await response.json();
        if (!response.ok) {
            return { error: result.message };
        }
        return result;
    } catch (error) {
        return { error: "Something went wrong" };
    }
};
