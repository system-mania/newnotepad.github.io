const txtName = document.querySelector('#txt-name');
const txtContent = document.querySelector('#txt-content');
const notesContainer = document.querySelector('.notes-container');
const newBtn = document.querySelector('.new-btn');

function newNoteCreate() {
  let id = Date.now();
  let name = '';
  let content = '';
  let lcvalue = { id: id, txtName: name, txtContent: content };
  console.log(lcvalue);

  localStorage.setItem(`notes${lcvalue.id}`, JSON.stringify(lcvalue));
  localStorage.setItem('prior', id);

  txtName.value = '';
  txtContent.value = '';
  txtName.focus();
}

newBtn.addEventListener('click', newNoteCreate);

function loadNote() {
  let prior = localStorage.getItem('prior');
  let notes = JSON.parse(localStorage.getItem(`notes${prior}`));
  if (notes !== null) {
    txtName.value = notes.txtName;
    txtContent.value = notes.txtContent;
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

txtName.addEventListener('input', loadNotes);

newBtn.addEventListener('click', loadNotes);

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
function deleteNotes(event) {
  // Get the parent note element
  const noteElement = event.target.parentElement.parentElement;
  console.log(noteElement);

  // Get the note id from the class list
  const noteId = Array.from(noteElement.classList).find(
    (className) => className !== 'note'
  );
  console.log(noteId);

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

function replaceText(event) {
  // Get the clicked div element
  const divElement = event.target;
  console.log(divElement.id);
  let prior = divElement.id;
  localStorage.setItem('prior', prior);
  let notes = JSON.parse(localStorage.getItem(`notes${prior}`));
  if (notes !== null) {
    txtName.value = notes.txtName;
    txtContent.value = notes.txtContent;
  }
}
loadNotes();
