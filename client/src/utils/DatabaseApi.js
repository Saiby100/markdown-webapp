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

    } catch (err) {
        console.log(err);
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

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }
}

const getNotes = async (userId, token) => {
    try {
        const endpoint = `${URL}/get-notes/${userId}`;

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        // console.log(response.json());
        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }

}

const addNote = async (userId, title, text, token) => {
    try {
        const endpoint = `${URL}/add-note/${userId}`;

        const noteData = {
            title: title,
            text: text
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }

}

const updateNote = async (noteId, title, text, token) => {

    try {
        const endpoint = `${URL}/update-note/${noteId}`;

        const noteData = {
            title: title,
            text: text
        };

        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }

}

const deleteNote = async (noteId, userId, token) => {
    try {
        const endpoint = `${URL}/delete-note/${noteId}/${userId}`;
        
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }

}

const shareNote = async (userId, shareToUser, noteId, token) => {
    try {
        const endpoint = `${URL}/share-note`;

        const shareData = {
            fromUserId: userId,
            toUsername: shareToUser,
            noteId: noteId
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(shareData)
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }
}

const deleteUser = async (userId, token) => {
    try {
        const endpoint = `${URL}/delete-user/${userId}`;

        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                "Authorization": token,
            },
        });

        return {
            json: await response.json(), 
            status: response.status
        };

    } catch (err) {
        console.log(err);
        return {json: {error: "Failed to make request"}, status: 500};
    }
    
}

export { loginUser, signupUser, getNotes, addNote, updateNote, deleteNote, shareNote, deleteUser };