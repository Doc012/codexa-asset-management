import { apiFetch } from "../assets/js/apiFetch.js";

export async function getAllUsers() {
    const response = await apiFetch(`/users`);

    return await response.json();
}

/**
 * 
 * @param {*} id user id from the users table
 * @returns user details in a json object
 */

export const getUserById = (async (userId) => {
    const res = await apiFetch(`/users/user/${userId}`);
    return await res.json();
});

/**
 * 
 * @param {*} email of the user
 * @returns user details in a json object
 */

export const getUserByEmail = (async (email) => {
    const res = await apiFetch(`/user/email/${email}`);
    return await res.json();
});

/**
 * 
 * @param {*} role 
 * @returns all users by their roles in a json object
 */
export const getAllUsersByRole = (async (role) => {
    const res = await apiFetch(`/role/${role}`);
    return await res.json();
})

/**
 * 
 * @param {*} userData 
 * @returns 
 */

export const createUser = (async (userData) => {
    const res = await apiFetch(`/users`, {
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
export const updateAllUserDetails = (async (id, userData) => {
    const res = await apiFetch(`/users/user/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!res.ok) {
        console.log(res)
    }

    return await res.json();
});

/**
 * Update user profile (firstName, lastName, picUrl)
 * @param {*} id user id
 * @param {*} profileData object containing { firstName, lastName, picUrl }
 */
export const updateUserProfile = async (userId, profileData) => {
    const res = await apiFetch(`/users/user/profile/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
    });

    if (!res.ok) {
        console.error("Failed to update profile:", res.status, res.statusText);
        throw new Error("Profile update failed");
    }

    return await res.json();
};


export const changePassword = async (userId, passwordRequest) => {
    const res = await apiFetch(`/auth/change-password/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordRequest),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.message || "Password update failed");
    }

    return await res.json();
};