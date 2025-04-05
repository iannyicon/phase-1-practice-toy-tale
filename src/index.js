let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const toyName = document.querySelector("#toy-name");
  const toyImage = document.querySelector("#toy-image");
  const toyUrl = "http://localhost:3000/toys";
  
  // Toggle the form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys and display them
  fetch(toyUrl)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((toy) => {
        const toyCard = document.createElement("div");
        toyCard.className = "card";
        toyCard.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;
        toyCollection.appendChild(toyCard);
      });
    })
    .catch((error) => console.error("Error:", error));

  // Handle form submission to create a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newToy = {
      name: toyName.value,
      image: toyImage.value,
      likes: 0,
    };

    fetch(toyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((data) => {
        // Create a new card for the toy and append it
        const toyCard = document.createElement("div");
        toyCard.className = "card";
        toyCard.innerHTML = `
          <h2>${data.name}</h2>
          <img src="${data.image}" class="toy-avatar" />
          <p>${data.likes} Likes</p>
          <button class="like-btn" id="${data.id}">Like ❤️</button>
        `;
        toyCollection.appendChild(toyCard);
        toyName.value = "";
        toyImage.value = "";
      })
      .catch((error) => console.error("Error:", error));
  });

  // Handle the like button click
  toyCollection.addEventListener("click", (event) => {
    if (event.target.className === "like-btn") {
      const toyId = event.target.id;
      const likes = parseInt(event.target.previousElementSibling.innerText.split(" ")[0]);
      const newLikes = likes + 1;

      fetch(`${toyUrl}/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((response) => response.json())
        .then((data) => {
          event.target.previousElementSibling.innerText = `${data.likes} Likes`;
        })
        .catch((error) => console.error("Error:", error));
    }
  });
});
