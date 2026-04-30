// Register new user logic
export async function register(firstName, lastName, email, password) {
    const response = await fetch(`http://localhost:8080/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({firstName, lastName, email, password}),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
}

// User login logic
export async function login(email, password) {
    const response = await fetch(`http://localhost:8080/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return response.json();
}