// Жители деревни: [номер, имя, профессия, id в stories.json, архетип]
const residents = [
  ['001', 'Тимофей Булыжников', 'Почтальон', 'timofey', 'Прокрастинатор'],
  ['002', 'Марфа Крошкина', 'Пекарь', 'marfa', 'Перфекционист'],
  ['003', 'Прохор Мельников', 'Мельник', 'prokhor', 'Трудоголик'],
  ['004', 'Анфиса Миронова', 'Учительница', 'anfisa', 'Спорщик'],
  ['005', 'Егор Тихонов', 'Рыбак', 'egor', 'Мечтатель'],
  ['006', 'Степан Гранитов', 'Кузнец', 'stepan', 'Эксперт'],
  ['007', 'Василиса Камушкина', 'Садовник', 'vasilisa', 'Спасатель'],
  ['008', 'Лука Щебёнкин', 'Сторож', 'luka', 'Тревожник'],
  ['009', 'Дарья Копейкина', 'Хозяйка лавки', 'darya', 'Охотник за скидками'],
  ['010', 'Фома Знаменский', 'Картограф', 'foma', 'Теоретик'],
  ['011', 'Кузьма Лаптев', 'Изобретатель', 'kuzma', 'Инженер'],
  ['012', 'Мирон Звонарёв', 'Музыкант', 'miron', 'Творец'],
  ['013', 'Никифор Гудков', 'Пасечник', 'nikifor', 'Болтун'],
  ['014', 'Таисия Архипова', 'Библиотекарь', 'taisiya', 'Коллекционер'],
  ['015', 'Елисей Перевалов', 'Путешественник', 'elisey', 'Авантюрист'],
  ['016', 'Савелий Уступкин', 'Староста', 'saveliy', 'Дипломат']
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
  const holder = document.getElementById('residents');
  holder.innerHTML = residents
    .map(([n, name, job, id, archetype]) => {
      const url = links[id];
      return `<article class="tile">
        <div class="resident-photo">
          <img src="${'residents/' + id + '_portrait.png'}"
               alt="${name}"
               loading="lazy" decoding="async">
        </div>
        <h2>${name}</h2>
        <p>${job} · № ${n}</p>
        ${archetype ? `<p>Архетип: ${archetype}</p>` : ""}
        ${url
          ? `<a href="${url}">Познакомиться с персонажем →</a>`
          : '<span class="muted">История готовится</span>'}
      </article>`;
    })
    .join('');

  // У каждого портрета собственный индикатор загрузки.
  holder.querySelectorAll('.resident-photo').forEach(photo => {
    const img = photo.querySelector('img');
    let settled = false;

    function showPortrait() {
      if (settled) return;
      settled = true;
      // Ждём декодирования: так не появится резкий пустой прямоугольник.
      const decoded = typeof img.decode === 'function'
        ? img.decode().catch(() => {})
        : Promise.resolve();
      decoded.then(() => {
        // Два кадра дают браузеру отрисовать исходное состояние перед переходом.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          photo.classList.add('is-loaded');
        }));
      });
    }

    function hideBrokenPortrait() {
      if (settled) return;
      settled = true;
      // При ошибке не оставляем бесконечно крутящийся индикатор.
      photo.remove();
    }

    img.addEventListener('load', showPortrait, {once: true});
    img.addEventListener('error', hideBrokenPortrait, {once: true});

    // Изображение из кеша может загрузиться ещё до назначения обработчиков.
    if (img.complete) {
      if (img.naturalWidth > 0) showPortrait();
      else hideBrokenPortrait();
    }
  });
}
// Иллюстрации перечисляются в gallery.json. GitHub Pages не умеет
// автоматически получать список файлов из папки gallery.
async function renderGallery() {
  const holder = document.getElementById('gallery');
  let manifest = [];
  try {
    const response = await fetch('gallery.json', {cache: 'no-cache'});
    if (!response.ok) throw new Error('gallery.json: ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('gallery.json должен содержать массив');
    manifest = data;
  } catch (error) {
    console.warn('Не удалось загрузить галерею:', error);
    holder.innerHTML = '<p class="muted">Галерея пока пуста. Добавь изображения в папку gallery и их имена в gallery.json.</p>';
    return;
  }
  if (!manifest.length) {
    holder.innerHTML = '<p class="muted">Галерея пока пуста. Добавь изображения в папку gallery и их имена в gallery.json.</p>';
    return;
  }

  holder.replaceChildren();
  const overlay = document.getElementById('overlay');
  const enlarged = document.getElementById('large');
  const close = document.getElementById('close-gallery');
  let previousFocus = null;
  function closeImage() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    enlarged.removeAttribute('src');
    document.body.classList.remove('gallery-lightbox-open');
    if (previousFocus) previousFocus.focus();
  }
  for (const item of manifest) {
    // Удобный формат: ["gallery/first.png", "gallery/second.jpg"]
    // Старый формат {"file":"gallery/first.png","title":"..."} тоже работает.
    const file = typeof item === 'string' ? item : item?.file;
    if (typeof file !== 'string' || !file.trim()) continue;
    const alt = typeof item === 'object' && typeof item.title === 'string' ? item.title : 'Иллюстрация деревни Галькино';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-picture';
    button.setAttribute('aria-label', 'Открыть иллюстрацию');
    const img = document.createElement('img');
    img.src = file;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => button.remove());
    button.append(img);
    button.addEventListener('click', () => {
      previousFocus = button;
      enlarged.src = img.currentSrc || img.src;
      enlarged.alt = alt;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('gallery-lightbox-open');
      close.focus();
    });
    holder.append(button);
  }
  close.addEventListener('click', closeImage);
  overlay.addEventListener('click', event => { if (event.target === overlay) closeImage(); });
  document.addEventListener('keydown', event => {
    if (!overlay.classList.contains('open')) return;
    if (event.key === 'Escape') closeImage();
    if (event.key === 'Tab') {
      event.preventDefault();
      close.focus();
    }
  });
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  renderShell();
  if (document.getElementById('residents')) renderResidents();
  if (document.getElementById('gallery')) renderGallery();

});
