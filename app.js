const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
const toggleThemeBtn = document.querySelector(".toggle-theme-btn");
const searchBar = document.querySelector(".search-bar");

// Load saved notes
function showNotes() {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    const notesData = JSON.parse(savedNotes);
    notesContainer.innerHTML = "";
    // Sort pinned notes first
    notesData.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    notesData.forEach((note) => {
      createNoteElement(note.title, note.content, note.pinned);
    });
  }
}

// Saving notes to localStorage
function updateStorage() {
  const notes = document.querySelectorAll(".input-box");
  const notesData = Array.from(notes).map((noteEl) => {
    return {
      title: noteEl.querySelector(".note-title").textContent,
      content: noteEl.querySelector(".note-content").textContent,
      pinned: noteEl.getAttribute("data-pinned") === "true",
    };
  });
  localStorage.setItem("notes", JSON.stringify(notesData));
}

// Create a new note element
function createNoteElement(title = "", content = "", pinned = false) {
  const inputBox = document.createElement("div");
  inputBox.className = "input-box";
  inputBox.setAttribute("contenteditable", "false");
  inputBox.setAttribute("data-pinned", pinned);
  if (pinned) inputBox.classList.add("pinned");

  // creating  div for title
  const titleDiv = document.createElement("div");
  titleDiv.className = "note-title";
  titleDiv.setAttribute("contenteditable", "false");
  titleDiv.textContent = title || "Title";

  //creating div for Content 
  const contentDiv = document.createElement("div");
  contentDiv.className = "note-content";
  contentDiv.setAttribute("contenteditable", "false");
  contentDiv.textContent = content || "Write your note here...";

  // Buttons: pin, edit, delete
  const pinBtn = document.createElement("span");
  pinBtn.className = "pin-btn";
  pinBtn.title = pinned ? "Unpin note" : "Pin note";
  pinBtn.textContent = "📌";

  const editBtn = document.createElement("img");
  editBtn.src = "https://cdn-icons-png.flaticon.com/128/1159/1159633.png"; // ✏️ icon
  editBtn.alt = "Edit";
  editBtn.className = "edit-btn";

  const deleteBtn = document.createElement("img");
  deleteBtn.src = "https://cdn-icons-png.flaticon.com/128/1214/1214428.png"; // 🗑️ icon
  deleteBtn.alt = "Delete";
  deleteBtn.className = "delete-btn";

  // Append buttons
  inputBox.appendChild(pinBtn);
  inputBox.appendChild(editBtn);
  inputBox.appendChild(deleteBtn);

  // Append title and content after buttons
  inputBox.appendChild(titleDiv);
  inputBox.appendChild(contentDiv);

  notesContainer.appendChild(inputBox);

  attachEventsToNote(inputBox);
}

// Attach event listeners to a note element
function attachEventsToNote(noteElement) {
  const deleteBtn = noteElement.querySelector(".delete-btn");
  const editBtn = noteElement.querySelector(".edit-btn");
  const pinBtn = noteElement.querySelector(".pin-btn");
  const titleDiv = noteElement.querySelector(".note-title");
  const contentDiv = noteElement.querySelector(".note-content");

  // Delete note
  deleteBtn?.addEventListener("click", () => {
    noteElement.remove();
    updateStorage();
  });

  // Pin/unpin ion functinality for note
  pinBtn?.addEventListener("click", () => {
    const pinned = noteElement.getAttribute("data-pinned") === "true";
    if (pinned) {
      noteElement.setAttribute("data-pinned", "false");
      noteElement.classList.remove("pinned");
      pinBtn.title = "Pin note";
      notesContainer.appendChild(noteElement);
    } else {
      noteElement.setAttribute("data-pinned", "true");
      noteElement.classList.add("pinned");
      pinBtn.title = "Unpin note";
      notesContainer.prepend(noteElement);
    }
    updateStorage();
  });

  // Edit toggle
  editBtn?.addEventListener("click", () => {
    const isEditable = titleDiv.isContentEditable;
    if (isEditable) {
      titleDiv.setAttribute("contenteditable", "false");
      contentDiv.setAttribute("contenteditable", "false");
      editBtn.src = "https://cdn-icons-png.flaticon.com/128/1159/1159633.png"; 
      updateStorage();
    } else {
      titleDiv.setAttribute("contenteditable", "true");
      contentDiv.setAttribute("contenteditable", "true");
      titleDiv.focus();
      editBtn.src = "https://cdn-icons-png.flaticon.com/128/1828/1828843.png"; 
    }
  });

  // Save changes on keyup
  titleDiv.addEventListener("keyup", updateStorage);
  contentDiv.addEventListener("keyup", updateStorage);
}

// Create new note button
createBtn.addEventListener("click", () => {
  createNoteElement();
  updateStorage();
});

// Theme toggle
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    toggleThemeBtn.textContent = "☀️ Light Mode";
  } else {
    toggleThemeBtn.textContent = "🌙 Dark Mode";
  }
});

// Search functionality for notes
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  const notes = document.querySelectorAll(".input-box");
  notes.forEach((note) => {
    const title = note.querySelector(".note-title").textContent.toLowerCase();
    const content = note
      .querySelector(".note-content")
      .textContent.toLowerCase();
    if (title.includes(query) || content.includes(query)) {
      note.style.display = "block";
    } else {
      note.style.display = "none";
    }
  });
});

// Initial load
showNotes();
