<div align="center">

# Вадим Грушин — Портфолио

**Go-разработчик · Backend / DevOps**<br>
Быстрый личный сайт без зависимостей: два языка (RU / EN), светлая и тёмная темы
и одностраничное резюме, собранное из тех же исходников.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![Без сборки](https://img.shields.io/badge/сборка-не_нужна-0e7490)
![Языки](https://img.shields.io/badge/язык-RU_%7C_EN-0b1220)
![Темы](https://img.shields.io/badge/тема-светлая_%7C_тёмная-0b1220)

[English](README.md) · **Русский**

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/hero-dark.png">
  <img alt="Первый экран: имя, роль и анимированная схема пути запроса через backend fintracker" src="docs/screenshots/hero-light.png" width="900">
</picture>

</div>

<br>

## Что это

Сайт, который я отправляю рекрутёрам и инженерам вместе с резюме. У него одна задача: за десять секунд
показать, **что я делаю, на чём и насколько хорошо**, а потом дать заглянуть в код.

Я backend-разработчик, поэтому снимать на скриншот нечего: у сервисов нет интерфейса. Вместо этого страница показывает, как устроена работа:

- **Первый экран — схема, а не фото.** Анимированная трассировка показывает путь запроса через
  [fintracker](https://github.com/moraziss/fintracker): `client → nginx → handler → service → repository → PostgreSQL`, сбоку Redis.
- **Проекты оформлены как кейсы,** а не как списки: схема архитектуры или доставки, затем четыре темы
  (архитектура, безопасность, производительность, доставка) с конкретными решениями.
- **Факты вместо эпитетов.** Полоса цифр (Go с 2024 года, ~20 эндпоинтов, 2 найденные и закрытые IDOR-уязвимости, 60+ тестов) вместо «увлечённый разработчик».

## Возможности

| | |
|---|---|
| **Два языка** | Русский текст лежит в HTML (работает без JS, виден поисковикам), английский словарь — в `main.js`. Прямые ссылки: `?lang=en`, `?lang=ru`. |
| **Светлая / тёмная тема** | По умолчанию светлая, выбор запоминается, `?theme=dark` для ссылки. Цвета — дизайн-токены в `style.css`. |
| **Адаптивность** | Вёрстка от телефона, без горизонтальной прокрутки, проверена от 375 px. |
| **Доступность** | Семантические блоки, skip-ссылка, видимый фокус, `aria-pressed`, уважает `prefers-reduced-motion`. |
| **Детали** | Подсветка текущего раздела в меню, «прожектор» за курсором на карточках, плавное появление, копирование почты в один клик. |
| **Без зависимостей** | Чистые HTML, CSS и JavaScript. Снаружи подгружаются только шрифты Google Fonts (Manrope, JetBrains Mono). |
| **Резюме из исходников** | HTML → PDF через headless Edge/Chrome: одна колонка, настоящий текст, правильный порядок чтения для ATS. RU и EN. |

## Скриншоты

<p align="center">
  <img alt="Телефон, светлая тема" src="docs/screenshots/mobile-light.png" width="260">
  &nbsp;&nbsp;
  <img alt="Телефон, тёмная тема" src="docs/screenshots/mobile-dark.png" width="260">
</p>

<details>
<summary><b>Страница целиком</b></summary>
<br>
<p align="center"><img alt="Страница целиком, светлая тема" src="docs/screenshots/full-light.png" width="780"></p>
</details>

<details>
<summary><b>Резюме (английская версия, одна страница)</b></summary>
<br>
<p align="center"><img alt="Резюме на одну страницу" src="docs/screenshots/resume-en.png" width="560"></p>
</details>

## Структура проекта

```
.
├── index.html           разметка и русский текст
├── style.css            дизайн-токены, светлая/тёмная темы, вёрстка, анимации
├── main.js              английский словарь, переключение языка и темы, подсветка меню, появление блоков, копирование почты
├── assets/              фавикон и публичные PDF резюме (RU / EN)
├── resume/              исходники резюме (HTML + CSS) и скрипт сборки PDF
├── scripts/             генератор скриншотов для этого README
└── docs/screenshots/    картинки для README
```

## Запуск локально

Установка и сборка не нужны. Достаточно любого статического сервера:

```bash
git clone https://github.com/moraziss/portfolio.git
cd portfolio
python -m http.server 5173
```

Откройте <http://localhost:5173> (можно добавить `?lang=en&theme=dark`).

## Как менять содержимое

- **Русский текст** — прямо в `index.html`.
- **Английский текст** — объект `EN` в начале `main.js`; ключ совпадает с атрибутом `data-i18n` у элемента.
- **Цвета и шрифты** — CSS-переменные в начале `style.css`.

## Как пересобрать резюме

```bash
powershell -ExecutionPolicy Bypass -File resume/build.ps1
```

Нужен Edge или Chrome. Результат:

- `assets/*.pdf` — публичные версии (без телефона), их отдаёт сайт; кнопка выбирает PDF по языку страницы.
- `resume/dist/*.pdf` — полные версии для рекрутёров. Телефон берётся из `resume/phone.local.txt`;
  этот файл в `.gitignore`, поэтому в публичный репозиторий он не попадает.

Картинки для README пересоздаются командой `powershell -ExecutionPolicy Bypass -File scripts/screenshots.ps1`.

## Публикация

GitHub Pages прямо из ветки `main`:

1. **Settings → Pages → Build and deployment →** *Deploy from a branch* → `main` / `(root)`.
2. Для своего домена впишите его в **Custom domain** (GitHub сам закоммитит файл `CNAME`) и включите **Enforce HTTPS**.
3. DNS у регистратора — для корневого домена четыре `A`-записи `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   для `www` — `CNAME` на `moraziss.github.io`.

## Контакты

[grusinvadim55@gmail.com](mailto:grusinvadim55@gmail.com) ·
[Telegram @moraziss](https://t.me/moraziss) ·
[LinkedIn](https://www.linkedin.com/in/vadim-grushin-0a9a0b392) ·
[GitHub @moraziss](https://github.com/moraziss)
