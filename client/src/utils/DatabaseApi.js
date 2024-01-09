const URL = "http://localhost:8000"

const loginUser = async (username, password) => {
    try {
        const endpoint = `${URL}/login`;

        const loginData = {
            name: username,
            password: password
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (error) {
        console.log(error);
        return {json: {error: "Failed to make request"}, status: 500};
    }
}

const signupUser = async (email, username, password) => {
    try {
        const endpoint = `${URL}/register`;

        const requestData = {
            email: email,
            name: username,
            password: password
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (error) {
        console.log(error);
        return {json: {error: "Failed to make request"}, status: 500};
    }
}

const getNotes = (userId, token) => {

}

const addNote = (userId, title, text, token) => {

}

const updateNote = (noteId, title, text, token) => {

}

const deleteNote = (noteId, userId, token) => {

}

const shareNote = (userId, shareToUser, noteId, token) => {

}


export { loginUser, signupUser, getNotes, addNote, updateNote, deleteNote, shareNote };