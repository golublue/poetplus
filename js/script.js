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
  init();
  const storage = JSON.parse(localStorage.getItem('storage'));
  console.log(storage)
  setInterval(() => {
    let text = [];
    const areas = document.querySelectorAll('textarea');
    areas.forEach(area => text.push($(area).val()));
    text = JSON.stringify(text);
    localStorage.setItem('storage', text)
  }, 10000);
})

$(document).on('keydown', (e) => {
  if (e.keyCode === 8 && !$(e.target).val()) {
    $(e.target).parent().prev().children('textarea').focus();
    if ($(e.target).parent().prev().length) {
      $(e.target).parent().remove();
    }
    return false
  }
  if (e.keyCode === 38) {
    e.preventDefault();
    $(e.target).parent().prev().children('textarea').focus();
    return false;
  }
  if (e.keyCode === 40) {
    e.preventDefault();
    $(e.target).parent().next().children('textarea').focus();
    return false;
  }
  if (e.keyCode === 13) {
    e.preventDefault();
    $(e.target).blur();
    if (!$(e.target).parent().next().children('textarea').length) {
      $('.container').append(`
        <div class="block">
          <textarea rows="1"></textarea>
          <span>0</span>
        </div>
      `);
      init();
    }
    $(e.target).parent().next().children('textarea').focus();
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