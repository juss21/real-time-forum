CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "username" TEXT UNIQUE,
    "password" TEXT,
    "email" TEXT UNIQUE,
    "age" INTEGER,
    "gender" TEXT,
    "firstname" TEXT,
    "lastname" TEXT
);

CREATE TABLE IF NOT EXISTS "session" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "key" TEXT UNIQUE,
    "userId" INTEGER UNIQUE
);

CREATE TABLE IF NOT EXISTS "comments" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "postId" INTEGER,
    "content" TEXT,
    "datecommented" TEXT
);

CREATE TABLE IF NOT EXISTS "category" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

CREATE TABLE IF NOT EXISTS "chat" (
    "messageid" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "receiverId" INTEGER,
    "datesent" TEXT,
    "message" TEXT
);

CREATE TABLE IF NOT EXISTS "posts" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "title" TEXT,
    "content" TEXT,
    "categoryId" INTEGER,
    "date" TEXT
);

INSERT INTO "users" ("username", "password", "email", "age", "gender", "firstname", "lastname") 
VALUES 
  ('m2nky', '123', 'm2nky@example.com', 25, 'Male', 'John', 'Doe'),
  ('7Eleven', '123', 'seven11@example.com', 30, 'Female', 'Jane', 'Smith');

INSERT INTO "session" ("key", "userId") 
VALUES 
  ('abcdef1234567890', 1),
  ('xyz9876543210abcdef', 2);

INSERT INTO "comments" ("userId", "postId", "content", "datecommented") 
VALUES 
  (1, 2, 'This is a comment by m2nky', '2023-07-22 12:34:56'),
  (2, 1, 'Comment from 7Eleven', '2023-07-22 13:45:00');

INSERT INTO "category" ("name") 
VALUES 
  ('Technology'),
  ('Travel');

INSERT INTO "chat" ("userid", "receiverid", "datesent", "message") 
VALUES 
  (1, 2, '2023-07-22 14:30', 'Hi 7Eleven, how are you?'),
  (2, 1, '2023-07-22 14:35', "Hey m2nky, I`m doing great.");

INSERT INTO "posts" ("userId", "title", "content", "categoryId", "date") 
VALUES 
  (1, 'Introduction', "Hello, I'm m2nky. Nice to meet you all.", 1, '2023-07-22 10:00'),
  (2, 'Travel Adventure', 'Exploring new places is so exciting.', 2, '2023-07-22 11:30');

