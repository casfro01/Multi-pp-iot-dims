DROP SCHEMA IF EXISTS quiz CASCADE;
CREATE SCHEMA IF NOT EXISTS quiz;

CREATE TABLE quiz.user(
    Id TEXT PRIMARY KEY NOT NULL,
    UserName TEXT NOT NULL,
    PasswordHash TEXT NOT NULL
);

create table quiz.quiz
(
    id   integer not null
        generated always as identity
        constraint quiz_pk
            primary key,
    name text
);

create table quiz.questions
(
    id      integer not null
        generated always as identity
        constraint questions_pk
            primary key,
    quiz_id integer not null
        constraint questions_questions_id_fk
            references quiz.quiz(id) ON DELETE CASCADE,
    content text
);

create table quiz.answers
(
    id          integer not null
        generated always as identity
        constraint answers_pk
            primary key,
    correct     boolean not null,
    content     text,
    question_id integer not null
        constraint answers_answers_id_fk
            references quiz.questions(id) ON DELETE CASCADE
);

create table quiz.user_device_link
(
    id          integer not null
        generated always as identity
        constraint user_device_link_pk
            primary key,
    user_id     text
                constraint user_id_fk
                references quiz.user(id) ON DELETE CASCADE,
    device_id     text UNIQUE,
    display_name text
);
