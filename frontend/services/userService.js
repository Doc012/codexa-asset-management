import {API_BASE_URL} from "../assets/js/config.js"

export async function getAllUsers() {
    const response = await fetch(
        `${API_BASE_URL}/users`
    );

    return await response.json();
}


/**
 * 
 * @param {*} id user id from the users table
 * @returns user details in a json object
 */

export const getUserById = (async (id) => {
    const res = await fetch(`${API_BASE_URL}/users/user/${id}`);
    return await res.json();
});

/**
 * 
 * @param {*} email of the user
 * @returns user details in a json object
 */

const getUserByEmail = (async (email) => {
    const res = await fetch(`${API_BASE_URL}/user/email/${email}`);
    return await res.json();
});

/**
 * 
 * @param {*} role 
 * @returns all users by their roles in a json object
 */
const getAllUsersByRole = (async (role) => {
    const res = await fetch(`${API_BASE_URL}/role/${role}`);
    return await res.json();
})

/**
 * 
 * @param {*} userData 
 * @returns 
 */

const createUser = (async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return await res.json();

});

/**
 * 
 * @param {*} id 
 * @param {*} userData 
 */
const updateAllUserDetails = (async (id, userData) => {
    const res = await fetch(`${API_BASE_URL}/users/user/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });
});

