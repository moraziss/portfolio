# Портфолио — Вадим Грушин

Статический сайт без сборки и зависимостей: `index.html`, `style.css`, `main.js`.

## Где что менять

- **Русский текст** — прямо в `index.html` (он же показывается, если JS выключен).
- **Английский текст** — объект `EN` в начале `main.js`; ключ совпадает с атрибутом `data-i18n` у элемента.
- **Цвета и шрифты** — переменные в начале `style.css` (`:root` — светлая тема, `:root[data-theme="dark"]` — тёмная).
- **Резюме** — тексты в `resume/resume.html` (RU) и `resume/resume-en.html` (EN), оформление в `resume/resume.css`. После правок пересоберите PDF:

  ```bash
  powershell -ExecutionPolicy Bypass -File resume/build.ps1
  ```

  Скрипт (нужен Edge или Chrome) кладёт PDF в две папки:
  `assets/` — публичная версия без телефона, её отдаёт сайт (RU/EN по языку страницы);
  `resume/dist/` — полная версия с телефоном, **её отправляйте рекрутёрам**.

  Телефон хранится только в `resume/phone.local.txt`. Этот файл и `resume/dist/` в `.gitignore`, в публичный репозиторий они не попадают. Без `phone.local.txt` скрипт соберёт только публичные версии.

## Запуск локально

```bash
python -m http.server 5173
```

Открыть http://localhost:5173. Ссылка сразу на английскую версию: `?lang=en`.

## Публикация на GitHub Pages

1. Создать репозиторий `moraziss.github.io` (тогда адрес будет `https://moraziss.github.io`) и залить туда эти файлы.
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Через минуту сайт откроется по адресу `https://moraziss.github.io`.
