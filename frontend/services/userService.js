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

export const getUserById = (async (userId) => {
    const res = await fetch(`${API_BASE_URL}/users/user/${userId}`);
    return await res.json();
});

/**
 * 
 * @param {*} email of the user
 * @returns user details in a json object
 */

export const getUserByEmail = (async (email) => {
    const res = await fetch(`${API_BASE_URL}/user/email/${email}`);
    return await res.json();
});

/**
 * 
 * @param {*} role 
 * @returns all users by their roles in a json object
 */
export const getAllUsersByRole = (async (role) => {
    const res = await fetch(`${API_BASE_URL}/role/${role}`);
    return await res.json();
})

/**
 * 
 * @param {*} userData 
 * @returns 
 */

export const createUser = (async (userData) => {
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
export const updateAllUserDetails = (async (userId, userData) => {
    const res = await fetch(`${API_BASE_URL}/users/user/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!res.ok){
        console.log(res)
    }

    return await res.json();
});

/**
 * Update user profile (firstName, lastName, picUrl)
 * @param {*} userId user id
 * @param {*} profileData object containing { firstName, lastName, picUrl }
 */
export const updateUserProfile = async (userId, profileData) => {
  const res = await fetch(`${API_BASE_URL}/users/user/profile/${userId}`, {
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
    const res = await fetch(`http://localhost:8080/api/v1/auth/change-password/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordRequest)
    });

    if (!res.ok){
        console.error("Failed to update the password: ", res.status, res.statusText);
        throw new Error("Password update failed");
    }

    return await res.json;
}



