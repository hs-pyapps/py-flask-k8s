CREATE DATABASE trident;
use trident;

CREATE TABLE category_tags(
    tag_id int AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    UNIQUE (name),
    PRIMARY KEY(tag_id)
);

CREATE TABLE users(
    user_id int AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    username varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    email varchar(220) NOT NULL,
    UNIQUE (username),
    PRIMARY KEY(user_id)
);

CREATE TABLE tweets(
    tweet_id int AUTO_INCREMENT,
    user_id int NOT NULL,
    tag_id int,
    content varchar(300) NOT NULL,
    privacy boolean NOT NULL,
    created timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (tag_id) REFERENCES category_tags(tag_id)
);

INSERT INTO users( first_name, last_name,username, password, email)
VALUES ('karina', 'gonzalez', 'karina', '123', 'karina@email.com'), 
('bob','slalom', 'bob', '123', 'bob@email.com'), 
('simon','sims', 'simon', '123', 'simon@email.com'), 
('gina', 'xu', 'gina', '123', 'gina@email.com');

INSERT INTO category_tags(name)
VALUES ("general"), ('health'), ('business'), ("world news"), ("music"), ("technology"), ('beauty'), ('movies and tv'), ('slalom');

INSERT INTO tweets(user_id,tag_id,content,privacy)
VALUES(1, 1, "my stomatch hurts", 0), 
(2, 4, "bts slays", 0),
(1, 2, "riri give us the album", 0),
(4, null, "#slalom4lyfe", 0);