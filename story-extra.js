
(() => {
  const residents = {
    timofey: "Тимофей Булыжников",
    marfa: "Марфа Крошкина",
    prokhor: "Прохор Мельников",
    anfisa: "Анфиса Миронова",
    egor: "Егор Тихонов",
    stepan: "Степан Гранитов",
    vasilisa: "Василиса Камушкина",
    luka: "Лука Щебёнкин",
    darya: "Дарья Копейкина",
    foma: "Фома Знаменский",
    kuzma: "Кузьма Лаптев",
    miron: "Мирон Звонарёв",
    nikifor: "Никифор Гудков",
    taisiya: "Таисия Архипова",
    elisey: "Елисей Перевалов",
    saveliy: "Савелий Уступкин"
  };

  // Ссылки на товары, добавляем по мере публикации
  const marketLinks = {
    // timofey: "https://example.com/product"
  };

  const id = location.pathname
    .split("/")
    .pop()
    .replace(/\.html$/i, "");

  const name = residents[id];
  const article = document.querySelector(
    "main.paper article.story"
  );

  if (!name || !article) return;

  const section = document.createElement("section");
  section.className = "story-extra";

  section.innerHTML = `
    <div class="story-extra-buy">
      <img
        src="../residents/${id}_portrait.png"
        alt="${name}"
        loading="lazy"
      >
      <div class="story-extra-buy-info">
        <h2>Пусть история продолжается дома!</h2>
        <p>
          ${name} может стать частью
          вашей собственной маленькой деревни.
        </p>
        <div class="story-extra-action"></div>
      </div>
    </div>
  `;

  const action = section.querySelector(
    ".story-extra-action"
  );

  const url = marketLinks[id];

  if (url && /^https?:\/\//i.test(url)) {
    const link = document.createElement("a");
    link.className = "story-extra-button";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Поселить героя у себя";
    action.appendChild(link);
  } else {
    const soon = document.createElement("span");
    soon.className = "story-extra-soon";
    soon.textContent = "Скоро можно будет поселить у себя";
    action.appendChild(soon);
  }

  article.insertAdjacentElement("afterend", section);
})();
