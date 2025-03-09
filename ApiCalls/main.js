// Wait for the DOM (HTML content) to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the elements in the HTML
    const userList = document.getElementById("userList"); // The list where user data will be displayed
    const loading = document.getElementById("loading"); // Loading spinner
    const error = document.getElementById("error"); // Error message container
  
    // Function to fetch user data from an API
    async function fetchUsers() {
      try {
        // Make a request to fetch user data from the Random User API
        const response = await fetch("https://randomuser.me/api/?results=10");

        // Check if the response is successful, otherwise throw an error
        if (!response.ok) throw new Error("Failed to fetch data");

        // Convert the response into JSON format
        const data = await response.json();
        const users = data.results; // Extract the 'results' array containing user data

        // Hide the loading spinner once data is received
        loading.style.display = "none";

        // Loop through the users and create list items
        users.forEach((user) => {
          const li = document.createElement("li");
          li.className = "list-group-item";

          // Extract user details correctly
          li.innerHTML = `
            <div>
                <img src="${user.picture.thumbnail}" alt="User Image" class="rounded-circle mr-2">
                <strong>${user.name.first} ${user.name.last}</strong>
                <div class="user-email">${user.email}</div>
            </div>
            <span class="badge badge-primary">${user.location.country}</span>
          `;

          // Append the list item to the user list in the HTML
          userList.appendChild(li);
        });
      } catch (err) {
        // Handle errors
        loading.style.display = "none";
        error.style.display = "block";
        error.textContent = "Error loading users: " + err.message;
      }
    }

    // Call the function to fetch user data when the page loads
    fetchUsers();
});
