import { apiFetch } from "../assets/js/apiFetch.js";

/**
 * Fetches all user records from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of all user objects.
 */
export async function getAllUsers() {
    const response = await apiFetch(`/users`);

    return await response.json();
}

/**
 * Fetches details for a single user by their unique user ID.
 * @param {string|number} userId - The unique identifier from the users table.
 * @returns {Promise<Object>} A promise that resolves to the user details object.
 */
export const getUserById = (async (userId) => {
    const res = await apiFetch(`/users/user/${userId}`);
    return await res.json();
});

/**
 * Fetches user details matching a specified email address.
 * @param {string} email - The email address of the target user.
 * @returns {Promise<Object>} A promise that resolves to the user details object.
 */
export const getUserByEmail = (async (email) => {
    const res = await apiFetch(`/user/email/${email}`);
    return await res.json();
});

/**
 * Fetches all user records assigned to a specific role.
 * @param {string} role - The name of the authorization role to filter by.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects matching the role.
 */
export const getAllUsersByRole = (async (role) => {
    const res = await apiFetch(`/role/${role}`);
    return await res.json();
})

/**
 * Submits a request to register or create a new user record.
 * @param {Object} userData - The creation properties and metadata payload for the user.
 * @returns {Promise<Object>} A promise that resolves to the newly created user object context.
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
 * Updates all comprehensive profile and system details for an individual user record.
 * @param {string|number} id - The database identifier of the target user record.
 * @param {Object} userData - The complete bundle of updated user attributes.
 * @returns {Promise<Object>} A promise that resolves to the modified user record response object.
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
 * Modifies specific publicly visible profile properties for an assigned user.
 * @param {string|number} userId - The database identifier of the user workspace.
 * @param {Object} profileData - A subset dictionary containing the updated firstName, lastName, and picUrl fields.
 * @returns {Promise<Object>} A promise that resolves to the freshly modified user profile object.
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

/**
 * Processes a security credential replacement check operation.
 * @param {string|number} userId - The identifier linked directly to the requested record target.
 * @param {Object} passwordRequest - A configuration map containing the required verification fields currentPassword and newPassword.
 * @returns {Promise<Object>} A promise that resolves to the successful message receipt payload.
 */
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
        const rawMessage = err.detail || err.message || "Password update failed";

        // Strip a leading "400 BAD_REQUEST" / "SOME_CODE" style prefix if present
        const cleanMessage = rawMessage.replace(/^\d{3}\s+[A-Z_]+\s*/, "");

        throw new Error(cleanMessage);
    }

    return await res.json();
};

/**
 * Updates only the status of a user.
 * @param {string|number} id - The database ID of the user.
 * @param {string} status - The new status (ACTIVE, INACTIVE, PENDING_APPROVAL, PENDING_VERIFICATION).
 * @returns {Promise<Object>} The updated user.
 */
export const updateUserStatus = async (id, status) => {
    const res = await apiFetch(
        `/users/user-status/${id}?status=${encodeURIComponent(status)}`,
        {
            method: "PUT"
        }
    );

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.message || "Failed to update user status.");
    }

    return await res.json();
};