
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
    timofey: "https://www.wildberries.ru/catalog/2266782238/detail.aspx",
    marfa: "https://www.wildberries.ru/catalog/2280748005/detail.aspx",
    prokhor: "https://www.wildberries.ru/catalog/2280747996/detail.aspx?targetUrl=GP",
    anfisa: "https://www.wildberries.ru/catalog/2280748001/detail.aspx",
    egor: "https://www.wildberries.ru/catalog/2280747997/detail.aspx?targetUrl=GP",
    stepan: "https://www.wildberries.ru/catalog/2280748002/detail.aspx",
    vasilisa: "https://www.wildberries.ru/catalog/2280748006/detail.aspx?targetUrl=GP",
    luka: "https://www.wildberries.ru/catalog/2280747998/detail.aspx",
    darya: "https://www.wildberries.ru/catalog/2280747999/detail.aspx?targetUrl=GP",
    foma: "https://www.wildberries.ru/catalog/2280748000/detail.aspx?targetUrl=GP",
    kuzma: "https://www.wildberries.ru/catalog/2280747993/detail.aspx?targetUrl=GP",
    miron: "https://www.wildberries.ru/catalog/2280748003/detail.aspx",
    nikifor: "https://www.wildberries.ru/catalog/2280748007/detail.aspx?targetUrl=GP",
    taisiya: "https://www.wildberries.ru/catalog/2280747994/detail.aspx?targetUrl=GP",
    elisey: "https://www.wildberries.ru/catalog/2280748004/detail.aspx",
    saveliy: "https://www.wildberries.ru/catalog/2280747995/detail.aspx?targetUrl=GP"
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
