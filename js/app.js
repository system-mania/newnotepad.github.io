const txtName = document.querySelector('#txt-name');
const txtContent = document.querySelector('#txt-content');
const notesContainer = document.querySelector('.notes-container');
const newBtn = document.querySelector('.new-btn');
const exportBtn = document.querySelector('.export-btn');
const importTXT = document.querySelector('#importTXT');

function newNoteCreate() {
  let id = Date.now();
  let name = 'new note';
  let content = '';
  let lcvalue = { id: id, txtName: name, txtContent: content };

  localStorage.setItem(`notes${lcvalue.id}`, JSON.stringify(lcvalue));
  localStorage.setItem('prior', id);

  txtName.value = '';
  txtContent.value = '';
}

newBtn.addEventListener('click', newNoteCreate);

function loadNote() {
  let prior = localStorage.getItem('prior');
  let notes = JSON.parse(localStorage.getItem(`notes${prior}`));

  if (notes !== null) {
    txtName.value = notes.txtName;
    txtContent.value = notes.txtContent;
  } else {
    newNoteCreate();
    loadNotes();
  }
}

loadNote();

function saveNotes() {
  let prior = localStorage.getItem('prior');
  let notes = JSON.parse(localStorage.getItem(`notes${prior}`));
  if (notes !== null) {
    notes.txtName = txtName.value;
    notes.txtContent = txtContent.value;
    localStorage.setItem(`notes${prior}`, JSON.stringify(notes));
  }
}

txtName.addEventListener('input', saveNotes);
txtContent.addEventListener('input', saveNotes);

function loadNotes() {
  //기존 노트 지우기
  while (notesContainer.hasChildNodes()) {
    notesContainer.removeChild(notesContainer.firstChild);
  }
  //새로운 노트 불러오기
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

txtName.addEventListener('input', loadNotes);
newBtn.addEventListener('click', loadNotes);

function deleteNotes(event) {
  const message = 'All content will be deleted\nAre you sure to delete all?';
  let result = confirm(message);
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
    loadNote();
  }
}

function replaceText(event) {
  // Get the clicked div element
  const divElement = event.target;
  let prior = divElement.id;
  localStorage.setItem('prior', prior);
  let notes = JSON.parse(localStorage.getItem(`notes${prior}`));
  if (notes !== null) {
    txtName.value = notes.txtName;
    txtContent.value = notes.txtContent;
  }
}

function exportTXT() {
  let c = document.createElement('a');
  c.download = txtName.value + '.txt';

  let t = new Blob([txtContent.value], {
    type: 'text/plain',
  });

  c.href = window.URL.createObjectURL(t);
  c.click();
}

exportBtn.addEventListener('click', exportTXT);

// HTML 요소를 참조합니다.
let importButton = document.querySelector('#importTXT');

// Add a click event listener to the button
importButton.addEventListener('click', function () {
  // Create a file input element
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt';

  // Simulate a click on the file input element
  fileInput.click();

  // When a file is selected, read its contents
  fileInput.addEventListener('change', function () {
    let file = this.files[0];
    let reader = new FileReader();

    reader.onload = function (event) {
      let fileName = file.name.replace('.txt', '');
      let txtContent = event.target.result;

      let id = Date.now();
      let lcvalue = { id: id, txtName: fileName, txtContent: txtContent };

      localStorage.setItem(`notes${lcvalue.id}`, JSON.stringify(lcvalue));
      localStorage.setItem('prior', id);

      loadNote();
      loadNotes();
    };

    // Read the file as text
    reader.readAsText(file);
  });
});

loadNotes();
