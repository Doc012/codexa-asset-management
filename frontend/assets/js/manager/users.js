import { getUserById } from "../../../services/userService.js";
import { API_BASE_URL } from "../config.js";
import { updateAllUserDetails } from "../../../services/userService.js";
import { getUser } from "../authContext.js"




/**
 * GetUser details by ID
 * Display all user details on the dashboard
 */
document.addEventListener("DOMContentLoaded", async () => {
    await userDetails();
});

const userId = getUser().id;

const userDetails = async()=> {
    const managerElement = document.querySelector(".ledger-title");
    const profileImage = document.querySelector(".profile-image")
    const profileInitial = document.querySelector(".profile-initial")

    try {
        const managerData = await getUserById(userId);

        if (managerData) {

            if (managerElement) {
                managerElement.textContent = `${managerData.firstName}'s Operational board`;
            }
        }

        if (profileImage && profileInitial) {
            if (managerData.picUrl !== null) {
                profileImage.src = managerData.picUrl;

            } else {
                profileInitial.textContent = `${managerData.firstName[0].toUpperCase()}`;
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
};


document.addEventListener("DOMContentLoaded", async()=> {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const department = document.getElementById("department");
  const profileForm = document.getElementById("profileForm");

  const userId = getUser()?.id;
  if (!userId) {
    console.error("No user in session — redirecting to login");
    window.location.href = "/pages/auth/login.html";
    return;
  }

  console.log(getUser());

  try {
    const user = await getUserById(userId);
    firstName.value = user.firstName || "";
    lastName.value = user.lastName || "";
    email.value = user.email || "";
    department.value = user.department || "";
  } catch (error) {
    console.error("Failed to load user:", error);
  }

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const profileData = {
      firstName: firstName.value,
      lastName: lastName.value
    };

    try {
      const updated = await updateUserProfile(userId, profileData);
      console.log("Profile updated:", updated);
    } catch (error) {
      console.error("Update failed:", error);
    }
  });


    try {

        const currentUser = await getUserById(userId);
        console.log(currentUser);
        const form = document.querySelector("#profile-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const userData = {
                "firstName": document.querySelector("#firstName").value,
                "lastName": document.querySelector("#lastName").value,
                "email": document.querySelector("#email").value,
                "department": currentUser.department,
                "picUrl": currentUser.picUrl
            }

            console.log(userData);
            try {
                await updateAllUserDetails(userId, userData);
                console.log("Hello There!")
            } catch (error) {
                console.log(error);
            }

        });

    } catch (error) {
        console.log(error);
    }

});



