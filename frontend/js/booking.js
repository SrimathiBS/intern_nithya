document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Login required");
    window.location.href = "login.html";
  }
});

document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const room = document.getElementById("room").value;

  const date = document.getElementById("date").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({ title, room ,date, startTime, endTime })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Booking successful!");
  } else {
    alert("Error: " + data.message);
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}
async function loadBookings() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/book/mine", {
    method: "GET",
    headers: {
      "Authorization": token
    }
  });

  const data = await res.json();

  if (res.ok) {
    const list = document.getElementById("bookingList");
    list.innerHTML = "";

    if (data.length === 0) {
      list.innerHTML = "<li>No bookings yet</li>";
    } else {
      data.forEach((booking) => {
        const li = document.createElement("li");
        li.textContent = `${booking.title} - ${booking.date} (${booking.startTime} to ${booking.endTime})`;
        list.appendChild(li);
      });
    }
  } else {
    alert("Failed to load bookings");
  }
}

// 🔁 Load on page start
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Login required");
    window.location.href = "login.html";
  } else {
    loadBookings(); // 👈 Load bookings now
  }
});
data.forEach((booking) => {
  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${booking.title}</strong> - ${booking.date} (${booking.startTime} to ${booking.endTime})
    <button onclick="deleteBooking('${booking._id}')">🗑</button>
    <button onclick="editBooking('${booking._id}', '${booking.title}', '${booking.date}', '${booking.startTime}', '${booking.endTime}')">✏️</button>
  `;
  list.appendChild(li);
});
async function deleteBooking(id) {
  const confirmDelete = confirm("Are you sure you want to delete this booking?");
  if (!confirmDelete) return;

  const res = await fetch(`http://localhost:5000/api/book/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": localStorage.getItem("token")
    }
  });

  const data = await res.json();
  if (res.ok) {
    alert("Booking deleted");
    loadBookings(); // refresh
  } else {
    alert(data.message);
  }
}
function editBooking(id, oldTitle, oldDate, oldStartTime, oldEndTime) {
  const newTitle = prompt("Edit title:", oldTitle);
  const newDate = prompt("Edit date (YYYY-MM-DD):", oldDate);
  const newStart = prompt("Edit start time (HH:MM):", oldStartTime);
  const newEnd = prompt("Edit end time (HH:MM):", oldEndTime);

  if (!newTitle || !newDate || !newStart || !newEnd) return alert("All fields required");

  fetch(`http://localhost:5000/api/book/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify({
      title: newTitle,
      date: newDate,
      startTime: newStart,
      endTime: newEnd
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "Booking updated") {
        alert("Booking updated successfully!");
        loadBookings(); // Refresh list
      } else {
        alert("Update failed: " + data.message);
      }
    });
}

let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

const newBooking = {
  title: document.getElementById("title").value,
  hall: document.getElementById("hall").value,
  date: document.getElementById("date").value,
  startTime: document.getElementById("startTime").value,
  endTime: document.getElementById("endTime").value,
  guests: document.getElementById("guests").value
};

bookings.push(newBooking);
localStorage.setItem("bookings", JSON.stringify(bookings));

window.location.href = "mybooking.html";
