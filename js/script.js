let observe;
const vowels = ['у', 'е', 'ы', 'а', 'о', 'ё', 'э', 'я', 'и', 'ю'];

if (window.attachEvent) {
  observe = function (element, event, handler) {
    element.attachEvent('on'+event, handler);
  };
} else {
  observe = function (element, event, handler) {
    element.addEventListener(event, handler, false);
  };
}
function init () {
  const areas = document.querySelectorAll('textarea');
  areas.forEach(text => {
    function resize () {
      text.style.height = 'auto';
      text.style.height = text.scrollHeight+'px';
    }
    function delayedResize () {
      window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);
  
    resize();
  })
}

$(document).ready(() => {
  const storage = JSON.parse(localStorage.getItem('storage'));
  if (storage.length && storage.map(x => x).join('').trim().length) {
    $('.container').empty();
    for (let i = 0; i < storage.length; i++) {
      $('.container').append(`
        <div class="block">
          <textarea rows="1">${storage[i]}</textarea>
          <span>0</span>
        </div>
      `)
    }
  }
  init();
  setInterval(() => {
    let text = [];
    const areas = document.querySelectorAll('textarea');
    areas.forEach(area => text.push($(area).val()));
    text = JSON.stringify(text);
    localStorage.setItem('storage', text)
  }, 5000);
})

$(document).on('keydown', (e) => {
  const parent = $(e.target).parent();
  const selectionEnd = $(e.target)[0].selectionEnd;
  const selectionStart = $(e.target)[0].selectionStart;
  if (
    e.keyCode === 8 && // backspace
    parent.prev().children('textarea').length &&
    selectionEnd === selectionStart &&
    selectionStart === 0
  ) {
    const prev = parent.prev().children('textarea');
    const start = prev.val().length;
    prev.focus();
    prev.val(prev.val() + $(e.target).val());
    prev[0].selectionStart = start;
    prev[0].selectionEnd = start;
    parent.remove();
    return false;
  }
  if (
    e.keyCode === 46 && // delete
    selectionEnd === selectionStart &&
    selectionEnd === $(e.target).val().length &&
    parent.next().children('textarea').length
  ) {
    const start = selectionStart;
    $(e.target).val($(e.target).val() + parent.next().children('textarea').val());
    $(e.target)[0].selectionEnd = start;
    $(e.target)[0].selectionStart = start;  
    parent.next().remove();
    return false;
  }
  if (
    e.keyCode === 37 && // arrow left
    selectionEnd === selectionStart &&
    selectionStart === 0 &&
    parent.prev().children('textarea').length
  ) {
    $(e.target).blur();
    const prev = parent.prev().children('textarea');
    const place = prev.val().length;
    prev.focus();
    prev[0].selectionStart = place;
    prev[0].selectionEnd = place;
    return false;
  }
  if (e.keyCode === 38) { // arrow top
    e.preventDefault();
    parent.prev().children('textarea').focus();
    return false;
  }
  if (
    e.keyCode === 39 && // arrow right
    selectionEnd === $(e.target).val().length &&
    parent.next().children('textarea').length
  ) {
    $(e.target).blur();
    const next = parent.next().children('textarea');
    next.focus();
    next[0].selectionStart = 0;
    next[0].selectionEnd = 0;
    return false;
  }
  if (e.keyCode === 40) { // arrow bottom
    e.preventDefault();
    parent.next().children('textarea').focus();
    return false;
  }
  if (e.keyCode === 13 && selectionEnd === selectionStart) { // enter
    e.preventDefault();
    $(e.target).blur();
    $(`
      <div class="block">
        <textarea rows="1"></textarea>
        <span>0</span>
      </div>
    `).insertAfter(parent);
    init();
    const next = parent.next().children('textarea');
    next.focus();
    if (selectionEnd !== $(e.target).val().length) {
      const cut = $(e.target).val().slice(selectionStart);
      $(e.target).val($(e.target).val().slice(0, selectionStart));
      next.val(cut);
      next[0].selectionStart = 0;
      next[0].selectionEnd = 0;
    }
    return false;
  }
})

$(document).on('keyup', (e) => {
  const val = $(e.target).val();
  let num = 0;
  for (let i = 0; i < val.length; i++) {
    if (vowels.includes(val[i])) {
      num++;
    }
  }
  $(e.target).next().text(num);
})

function done() {
  $('.res').empty();
  const areas = document.querySelectorAll('textarea');
  let text = '';
  areas.forEach(area => text += $(area).val() + '<br>');
  $('.res').append(text);
}