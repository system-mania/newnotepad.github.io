// Select HTML elements
const txtName = document.querySelector('#txt-name');
const txtContent = document.querySelector('#txt-content');
const notesContainer = document.querySelector('.notes-container');
const newBtn = document.querySelector('.new-btn');
const exportBtn = document.querySelector('.export-btn');
const importBtn = document.querySelector('.import-btn');

// Create a new note
function newNoteCreate() {
  const id = Date.now();
  const name = 'new note';
  const content = '';
  const lcvalue = { id, txtName: name, txtContent: content };

  localStorage.setItem(`notes${lcvalue.id}`, JSON.stringify(lcvalue));
  localStorage.setItem('prior', id);

  txtName.value = '';
  txtContent.value = '';
}

// Load the current note
function loadNote() {
  const prior = localStorage.getItem('prior');
  const notes = JSON.parse(localStorage.getItem(`notes${prior}`));

  if (notes !== null) {
    txtName.value = notes.txtName;
    txtContent.value = notes.txtContent;
  } else {
    localStorage.removeItem('prior');
    newNoteCreate();
    loadNotes();
  }
}

// Save the current note
function saveNotes() {
  const prior = localStorage.getItem('prior');
  const notes = JSON.parse(localStorage.getItem(`notes${prior}`));

  if (notes !== null) {
    notes.txtName = txtName.value;
    notes.txtContent = txtContent.value;
    localStorage.setItem(`notes${prior}`, JSON.stringify(notes));
  }
}

// Load all notes
function loadNotes() {
  // Remove all existing notes
  while (notesContainer.hasChildNodes()) {
    notesContainer.removeChild(notesContainer.firstChild);
  }

  // Load all notes from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.includes('notes')) {
      const note = JSON.parse(localStorage.getItem(key));
      const noteObj = {
        id: note.id,
        txtName: note.txtName,
        txtContent: note.txtContent,
      };

      const noteDiv = document.createElement('div');
      noteDiv.classList.add('note');
      noteDiv.classList.add(noteObj.id);
      noteDiv.innerHTML = `
        <div class="note-head">
          <div class="note-name" id=${noteObj.id} type="text" onclick="replaceText(event)">${noteObj.txtName}</div>
          <button class="note-delete" onclick='deleteNotes(event)'>X</button>  
        </div>
      `;

      notesContainer.appendChild(noteDiv);
    }
  }
}

// Delete a note
function deleteNotes(event) {
  const message = 'All content will be deleted\nAre you sure to delete all?';
  const result = confirm(message);

  if (result) {
    // Get the parent note element
    const noteElement = event.target.parentElement.parentElement;

    // Get the note id from the class list
    const noteId = Array.from(noteElement.classList).find(
      (className) => className !== 'note'
    );

    if (localStorage.getItem('prior') === noteId) {
      localStorage.removeItem('prior');
    }

    // Remove the note from localStorage
    localStorage.removeItem(`notes${noteId}`);

    // Remove the note element from the DOM
    noteElement.remove();

    // Reload the notes
    loadNotes();
  }
}

// Replace the current note with a different note
function replaceText(event) {
  const divElement = event.target;
  const prior = divElement.id;
  localStorage.setItem('prior', prior);
  const notes = JSON.parse(localStorage.getItem(`notes${prior}`));

  if (notes !== null) {
    txtName.value = notes.txtName;
    txtContent.value = notes.txtContent;
  }
}

// Export the current note as a text file
function exportTXT() {
  const c = document.createElement('a');
  c.download = txtName.value + '.txt';

  const t = new Blob([txtContent.value], {
    type: 'text/plain',
  });

  c.href = window.URL.createObjectURL(t);
  c.click();
}

// Import a text file as a new note
function importTXT() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt';

  fileInput.click();

  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileName = file.name.replace('.txt', '');
      const txtContent = event.target.result;

      const id = Date.now();
      const lcvalue = { id, txtName: fileName, txtContent };

      localStorage.setItem(`notes${lcvalue.id}`, JSON.stringify(lcvalue));
      localStorage.setItem('prior', id);

      loadNote();
      loadNotes();
    };

    reader.readAsText(file);
  });
}

// Add event listeners
newBtn.addEventListener('click', newNoteCreate);
txtName.addEventListener('input', saveNotes);
txtContent.addEventListener('input', saveNotes);
txtName.addEventListener('input', loadNotes);
newBtn.addEventListener('click', loadNotes);
exportBtn.addEventListener('click', exportTXT);
importBtn.addEventListener('click', importTXT);

// Load the notes
loadNote();
loadNotes();
