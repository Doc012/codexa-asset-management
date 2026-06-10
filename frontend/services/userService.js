import {API_BASE_URL} from "../assets/js/config.js"

export async function getAllUsers() {
    const response = await fetch(
        `${API_BASE_URL}/users`
    );

    return await response.json();
}


/**
 * Getting a user by an id
 */

export const getUserById = (async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/user/${id}`);
    return await res.json();
});