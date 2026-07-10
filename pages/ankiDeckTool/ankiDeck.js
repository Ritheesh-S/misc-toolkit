const tableBody = document.getElementById('tableBody');
const addRowBtn = document.getElementById('addRowBtn');
const exportBtn = document.getElementById('exportBtn');

function createCellTextarea(type, rowIndex) {
  const textarea = document.createElement('textarea');
  textarea.dataset.type = type;
  textarea.dataset.row = rowIndex;

  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const currentRow = textarea.closest('tr');
      const nextRow = currentRow.nextElementSibling;

      if (!nextRow) {
        addRow();
      }

      const targetRow = currentRow.nextElementSibling;

      if (type === 'front') {
        targetRow.querySelector('[data-type="front"]').focus();
      } else {
        targetRow.querySelector('[data-type="back"]').focus();
      }
    }
  });

  textarea.addEventListener('paste', (e) => {
    const pasted = (e.clipboardData || window.clipboardData).getData('text');

    if (!pasted.includes('\n')) {
      return;
    }

    e.preventDefault();

    const lines = pasted
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const currentRow = textarea.closest('tr');
    let row = currentRow;

    lines.forEach((line, index) => {
      if (!row) {
        addRow();
        row = tableBody.lastElementChild;
      }

      const targetTextarea = row.querySelector(`[data-type="${type}"]`);
      targetTextarea.value = line;

      if (index < lines.length - 1) {
        if (!row.nextElementSibling) {
          addRow();
        }
        row = row.nextElementSibling;
      }
    });
  });

  return textarea;
}

function updateRowNumbers() {
  [...tableBody.children].forEach((row, index) => {
    row.querySelector('.row-number').textContent = index + 1;
  });
}

function addRow(frontValue = '', backValue = '') {
  const rowIndex = tableBody.children.length;
  const tr = document.createElement('tr');

  const numberTd = document.createElement('td');
  numberTd.className = 'row-number';
  numberTd.textContent = rowIndex + 1;

  const frontTd = document.createElement('td');
  const backTd = document.createElement('td');

  const frontTextarea = createCellTextarea('front', rowIndex);
  const backTextarea = createCellTextarea('back', rowIndex);

  frontTextarea.value = frontValue;
  backTextarea.value = backValue;

  frontTd.appendChild(frontTextarea);
  backTd.appendChild(backTextarea);

  tr.appendChild(numberTd);
  tr.appendChild(frontTd);
  tr.appendChild(backTd);

  tableBody.appendChild(tr);
  updateRowNumbers();
}

if (tableBody && addRowBtn && exportBtn) {
  addRow();

  addRowBtn.addEventListener('click', () => {
    addRow();
  });

  exportBtn.addEventListener('click', () => {
    const rows = [...tableBody.children];

    const content = rows
      .map((row) => {
        const front = row.querySelector('[data-type="front"]').value
          .replace(/\t/g, ' ')
          .trim();

        const back = row.querySelector('[data-type="back"]').value
          .replace(/\t/g, ' ')
          .trim();

        return `${front}\t${back}`;
      })
      .filter((line) => line.trim() !== '\t')
      .join('\n');

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anki_deck.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
