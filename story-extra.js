
(() => {
  // Все 16 жителей деревни
  const residents = [
    ["timofey", "Тимофей Булыжников"],
    ["marfa", "Марфа Крошкина"],
    ["prokhor", "Прохор Мельников"],
    ["anfisa", "Анфиса Миронова"],
    ["egor", "Егор Тихонов"],
    ["stepan", "Степан Гранитов"],
    ["vasilisa", "Василиса Камушкина"],
    ["luka", "Лука Щебёнкин"],
    ["darya", "Дарья Копейкина"],
    ["foma", "Фома Знаменский"],
    ["kuzma", "Кузьма Лаптев"],
    ["miron", "Мирон Звонарёв"],
    ["nikifor", "Никифор Гудков"],
    ["taisiya", "Таисия Архипова"],
    ["elisey", "Елисей Перевалов"],
    ["saveliy", "Савелий Уступкин"]
  ];

  // Ссылки на маркетплейс.
  // Заполняем по мере появления товаров.
  const marketLinks = {
    // timofey: "https://ссылка-на-товар"
  };

  // Определяем героя по имени HTML-файла
  const id = location.pathname
    .split("/")
    .pop()
    .replace(/\.html$/i, "");

  const current = residents.find(r => r[0] === id);
  const article = document.querySelector("main.paper article.story");

  if (!current || !article) return;

  const section = document.createElement("section");
  section.className = "story-extra";

  // Ссылки на истории всех остальных жителей
  const otherLinks = residents
    .filter(r => r[0] !== id)
    .map(r => `
      <a href="./${r[0]}.html">${r[1]}</a>
    `)
    .join("");

  section.innerHTML = `
    <div class="story-extra-more">
      <h2>В Галькино живут и другие истории</h2>
      <p>
        У каждого жителя свои мечты, привычки
        и маленькие приключения.
        С кем познакомимся дальше?
      </p>
      <nav class="story-extra-links"
           aria-label="Истории других жителей">
        ${otherLinks}
      </nav>
    </div>
  `;

  // Кнопка покупки появляется только при наличии ссылки
  const marketUrl = marketLinks[id];

  if (marketUrl && /^https?:\/\//i.test(marketUrl)) {
    const buy = document.createElement("div");
    buy.className = "story-extra-buy";

    buy.innerHTML = `
      <img src="../residents/${id}_portrait.png"
           alt="${current[1]}"
           loading="lazy">

      <div class="story-extra-buy-info">
        <h2>Пусть история продолжается дома!</h2>
        <p>
          ${current[1]} может стать частью
          вашей собственной маленькой деревни.
        </p>
        <a class="story-extra-button"
           target="_blank"
           rel="noopener noreferrer">
          Поселить героя у себя
        </a>
      </div>
    `;

    buy.querySelector("a").href = marketUrl;
    section.prepend(buy);
  }

  // Вставляем новый блок сразу после рассказа
  article.insertAdjacentElement("afterend", section);
})();
