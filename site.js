// Жители деревни: [номер, имя, профессия, id в stories.json]
const residents = [
  ['001', 'Тимофей Булыжников', 'Почтальон', 'timofey'],
  ['002', 'Марфа Крошкина', 'Пекарь', 'marfa'],
  ['003', 'Прохор Мельников', 'Мельник', 'prokhor'],
  ['004', 'Анфиса Миронова', 'Учительница', 'anfisa'],
  ['005', 'Егор Тихонов', 'Рыбак', 'egor'],
  ['006', 'Степан Гранитов', 'Кузнец', 'stepan'],
  ['007', 'Василиса Камушкина', 'Садовник', 'vasilisa'],
  ['008', 'Лука Щебёнкин', 'Сторож', 'luka'],
  ['009', 'Дарья Копейкина', 'Хозяйка лавки', 'darya'],
  ['010', 'Фома Знаменский', 'Картограф', 'foma'],
  ['011', 'Кузьма Лаптев', 'Изобретатель', 'kuzma'],
  ['012', 'Мирон Звонарёв', 'Музыкант', 'miron'],
  ['013', 'Никифор Гудков', 'Пасечник', 'nikifor'],
  ['014', 'Таисия Архипова', 'Библиотекарь', 'taisiya'],
  ['015', 'Елисей Перевалов', 'Путешественник', 'elisey'],
  ['016', 'Савелий Уступкин', 'Староста', 'saveliy']
];

// Читает stories.json — объект вида { "timofey": "stories/timofey.html", ... }
async function getStories() {
  try {
    const r = await fetch('stories.json');
    if (r.ok) return await r.json();
  } catch (e) {
    // файла нет — работаем с пустым списком
  }
  return {};
}

const nav = [
  ['О деревне', 'about.html'],
  ['Наши жители', 'residents.html'],
  ['Как это работает', 'how.html'],
  ['Галерея', 'gallery.html'],
  ['Контакты', 'contacts.html']
];

// Оболочка: шапка с навигацией и подвал
function renderShell() {
  const page = location.pathname.split('/').pop();

  document.querySelector('header').innerHTML =
    '<nav>' +
    '<a class="brand" href="index.html">Деревня Галькино</a>' +
    nav
      .map(([t, u]) => `<a ${page === u ? 'class="active"' : ''} href="${u}">${t}</a>`)
      .join('') +
    '<a class="buy" href="buy.html">Где купить?</a>' +
    '</nav>';

  document.querySelector('footer').textContent =
    'Галькино — маленькая деревня больших историй';
}

// Сетка карточек жителей
async function renderResidents() {
  const links = await getStories();

  document.getElementById('residents').innerHTML = residents
    .map(([n, name, job, id]) => {
      const url = links[id];
      return `<article class="tile">
        <img src="${'residents/' + id + '_portrait.png'}"
             alt="${name}"
             onerror="this.style.display='none'">
        <h2>${name}</h2>
        <p>${job} · № ${n}</p>
        ${url
          ? `<a href="${url}">Читать историю →</a>`
          : '<span class="muted">История готовится</span>'}
      </article>`;
    })
    .join('');
}

// Галерея по gallery.json: [ { "file": "...", "title": "..." }, ... ]
async function renderGallery() {
  let manifest = [];
  try {
    const r = await fetch('gallery.json');
    if (r.ok) manifest = await r.json();
  } catch (e) {
    // gallery.json нет — покажем подсказку
  }

  document.getElementById('gallery').innerHTML = manifest.length
    ? manifest
        .map(item => `<figure class="tile">
          <img src="${item.file}" alt="${item.title || 'Иллюстрация'}" tabindex="0">
          <figcaption>${item.title || ''}</figcaption>
        </figure>`)
        .join('')
    : '<p class="muted">Добавь иллюстрации в gallery.json — они появятся здесь автоматически.</p>';

  // Клик / Enter по картинке — открытие лайтбокса
  document.querySelectorAll('.gallery img').forEach(el => {
    const open = () => {
      document.getElementById('large').src = el.src;
      document.getElementById('overlay').classList.add('open');
    };
    el.onclick = open;
    el.onkeydown = e => { if (e.key === 'Enter') open(); };
  });
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  renderShell();

  if (document.getElementById('residents')) renderResidents();
  if (document.getElementById('gallery')) renderGallery();

  // Закрытие лайтбокса: клик по фону или Escape
  const o = document.getElementById('overlay');
  if (o) o.onclick = () => o.classList.remove('open');

  document.onkeydown = e => {
    if (e.key === 'Escape' && o) o.classList.remove('open');
  };
});
