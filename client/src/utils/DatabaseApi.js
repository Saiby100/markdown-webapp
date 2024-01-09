const URL = "http://localhost:8000"

const loginUser = async (username, password) => {
    try {
        const endpoint = `${URL}/login`;

        const loginData = {
            name: username,
            password: password
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        return await response.json();

    } catch (error) {
        return {status: 500, error: "Failed to make request"};
    }
}

export { loginUser };