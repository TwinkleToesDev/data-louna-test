## Тестовое задание 
### на позицию NodeJS backend developer

### Описание проекта
Этот проект представляет собой веб-сервер на Node.js, построенный с использованием Fastify, TypeScript и Postgres.js.

### Требования

	•	Node.js (версия >= 18.x)
	•	npm (версия >= 6.x)
	•	TypeScript (версия >= 4.x) 
	•	PostgreSQL (версия >= 12.x)
	•	Redis (версия >= 5.x)

### Установка

Перед установкой необходимо создать и запустить PostgresSQL базу данных, запустить Redis и настроить файл `env` в корне проекта. `env` файл я добавил в git, чтобы ускорить настройку проекта

1. Клонируйте репозиторий
2. Установите зависимости `npm install`
3. Запустите миграции `npm run migrate`
4. Запустите сиды `npm run seed` (создаст только пользователей)
5. Запустите сервер `npm run dev`

Если приложение успешно запущено, по адресу http://127.0.0.1:3000 вы получите ответ:

```
{
"response": "OK"
}
```

### Дополнительно
Я сделал получение товаров из skinport по крону раз в 6 минут. Так же товары подгружаются при запуске сервера. 
Если получаете ошибку "Error: 429 Too Many Requests", стоит подождать некоторое время, чтобы у skinport спал лимит.


### Эндпоинты API

#### 1. Эндпоинт: POST /login

Описание: Аутентифицирует пользователя и начинает сессию.

Пример:
```curl
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "your_password"}' \
  -c cookies.txt
  ```

#### 2. Эндпоинт: PUT /change-password

Описание: Позволяет аутентифицированному пользователю изменить свой пароль.

```curl
curl -X PUT http://localhost:3000/change-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"currentPassword": "your_current_password", "newPassword": "your_new_password"}'
```

#### 3. Эндпоинт: GET /items

Описание: Отдает массив предметов с двумя минимальными ценами на каждый предмет: одна для торгуемых предметов, другая для неторгуемых.

```curl
curl http://localhost:3000/items
```

#### 4. Эндпоинт: POST /purchase

Описание: Позволяет аутентифицированному пользователю купить предмет. Обновляет баланс пользователя и количество предмета.

```curl
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"itemId": 1, "quantity": 1}'
```

### Схема базы данных

Я создал миграции и модели, в которых можно подробнее посмотреть схему БД. В корне проекта есть папка `migrations`, в которой находятся файлы миграций. В папке `src/models` находятся модели.

#### Таблица `users`

| Column  |  Type |  Constraints |
|---|---|---|
|  id |  SERIAL | PRIMARY KEY  |
| username  | VARCHAR(255)  |  UNIQUE, NOT NULL |
| name  | VARCHAR(255)  | NOT NULL  |
| email  | VARCHAR(255)  |  UNIQUE, NOT NULL |
| password_hash  |  VARCHAR(255) | NOT NULL  |
| balance  |  DECIMAL(10, 2) |  DEFAULT 0 |

#### Таблица `items`

| Column  |  Type |  Constraints |
|---|---|--|
| id  | SERIAL  |  PRIMARY KEY|
| market_hash_name  |  VARCHAR(255) | NOT NULL |
| currency  |  VARCHAR(3) | NOT NULL |
|  suggested_price | DECIMAL(10, 2)  |  |
| item_page  |  TEXT |  |
|  market_page |  TEXT |  |
|  min_price |  DECIMAL(10, 2) |  |
|max_price| DECIMAL(10, 2)  |  |
| mean_price  |  DECIMAL(10, 2) |  |
| quantity  |  INT  | DEFAULT 0 |
| tradable  | BOOLEAN   |  DEFAULT TRUE|

#### Таблица `purchases`

| Column  |  Type |  Constraints |
|---|---|-|
| id  | SERIAL  | PRIMARY KEY|
|  user_id |  INTEGER | NOT NULL, REFERENCES users(id)|
| item_id  | INTEGER  | NOT NULL, REFERENCES items(id)|
| price  | DECIMAL(10, 2)  | NOT NULL|
| quantity  | INTEGER  |NOT NULL, DEFAULT 1 |
| created_at  | TIMESTAMP  |DEFAULT NOW() |
