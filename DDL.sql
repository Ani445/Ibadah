DROP TABLE PROFILE;
DROP TABLE CREDENTIALS;

CREATE TABLE CREDENTIALS
(
    USER_ID       BIGINT AUTO_INCREMENT,
    EMAIL         VARCHAR(30),
    PASSWORD_HASH VARCHAR(64),
    CONSTRAINT CREDENTIALS_PK PRIMARY KEY (USER_ID),
    CONSTRAINT CREDENTIALS_UNIQ UNIQUE (EMAIL)
);

CREATE TABLE PROFILE
(
    USER_ID    BIGINT,
    FIRST_NAME VARCHAR(20) NOT NULL,
    LAST_NAME  VARCHAR(20),
    GENDER     TINYINT, # 1 for male, 0 for female
    COUNTRY    VARCHAR(20),
    CONSTRAINT PROFILE_PK PRIMARY KEY (USER_ID),
    CONSTRAINT PROFILE_FK FOREIGN KEY (USER_ID) REFERENCES CREDENTIALS (USER_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table classes;
CREATE TABLE CLASSES
(
    POST_ID BIGINT AUTO_INCREMENT,
    USER_ID BIGINT,
    TOPIC   VARCHAR(100),
    TEACHER VARCHAR(100),
    DATE    DATE,
    TIME    TIME,
    ONLINE  TINYINT, #ONLY 0 OR 1
    ADDRESS VARCHAR(100),
    CONSTRAINT CLASSES_PK PRIMARY KEY (POST_ID),
    CONSTRAINT CLASSES_FK_USER FOREIGN KEY (USER_ID) REFERENCES PROFILE(USER_ID)
);

/* user's daily tasks*/
CREATE TABLE DAILY_PLANS
(
    TASK_ID     BIGINT AUTO_INCREMENT,
    USER_ID     BIGINT,
    DATE        DATETIME,
    START_TIME  TIME,
    END_TIME    TIME,
    TASK_NAME   VARCHAR(50),
    DESCRIPTION MEDIUMBLOB,
    CONSTRAINT DAILY_TASKS_PK PRIMARY KEY (TASK_ID),
    CONSTRAINT DAILY_TASKS_FK FOREIGN KEY (USER_ID) REFERENCES CREDENTIALS (USER_ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE POSTS
(
    POST_ID   BIGINT AUTO_INCREMENT,
    USER_ID   BIGINT,
    USER_NAME VARCHAR(50),
    TOPIC     TEXT,
    DATE      DATE,
    TIME      TIME,
    CONSTRAINT POSTS_PK PRIMARY KEY (POST_ID),
    CONSTRAINT POSTS_FK FOREIGN KEY (USER_ID) REFERENCES CREDENTIALS (USER_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Comments
(
    Comment_ID   BIGINT AUTO_INCREMENT,
    Post_ID      BIGINT,
    User_ID      BIGINT,
    USER_NAME    VARCHAR(50),
    Comment_Text TEXT,
    DATE         DATE,
    TIME         TIME,
    CONSTRAINT Comments_PK PRIMARY KEY (Comment_ID),
    CONSTRAINT Comments_FK_Post FOREIGN KEY (Post_ID) REFERENCES Posts (Post_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE CATEGORY
(
    CAT_ID   BIGINT AUTO_INCREMENT,
    CAT_DESC VARCHAR(50),
    CONSTRAINT CAT_PK PRIMARY KEY (CAT_ID)
);

CREATE TABLE DUA
(
    DUA_ID   BIGINT AUTO_INCREMENT,
    CAT_ID   BIGINT,
    TITLE    VARCHAR(100),
    DUA_TEXT TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    MEANING  TEXT,
    SOURCE   VARCHAR(50),
    CONSTRAINT DUA_PK PRIMARY KEY (DUA_ID),
    CONSTRAINT DUA_FK FOREIGN KEY (CAT_ID) REFERENCES CATEGORY (CAT_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE NOTIFICATIONS
(
    NOTIFICATION_ID BIGINT AUTO_INCREMENT,
    USER_ID         BIGINT,
    WHAT_FOR        VARCHAR(30),
    TIME            DATETIME,
    CONSTRAINT NOTIFICATION_PK PRIMARY KEY (NOTIFICATION_ID),
    CONSTRAINT NOTIFICATION_FK_USER FOREIGN KEY (USER_ID) REFERENCES CREDENTIALS (USER_ID)
);

insert into notifications values (1, 1, 'prayer-asr-started', now());
insert into notifications values (2, 1, 'prayer-maghrib-30', now());
insert into notifications values (3, 1, 'prayer-asr-started', '2023-10-10');
insert into notifications values (4, 1, 'prayer-maghrib-30', '2023-11-25');


SELECT *
FROM NOTIFICATIONS
WHERE USER_ID = 1
  AND date(TIME) = date('2023-11-26')
ORDER BY TIME DESC;


create table important_dates(
arab_date varchar2(50),
significance varchar2(100)
);
enter into important_dates values( '1 Muharram', 'Islamic New Year');
enter into important_dates values( '10 Muharram', 'Day of Ashura');
enter into important_dates values( '12 Rabi' I', 'Birth of Prophet(SM)');
enter into important_dates values( '27 Rajab', 'Isra and Miraj');
enter into important_dates values( '12 Rabiʻ I', 'Birth of Prophet(SM)');
enter into important_dates values( '15 Shaʻban', 'Mid Shaʻban or Night of Forgiveness');
enter into important_dates values( '1 Ramadan', 'First Day of Saom');
enter into important_dates values( '27 Ramadan', 'Start of revelation of Qur'an, Laylatul Qadr');
enter into important_dates values( '1 Shawwal', 'Eid ul Fitr');
enter into important_dates values( '8-13 Dhuʻl-Hijjah', 'Hajj');
enter into important_dates values( '9 Dhuʻl-Hijjah', 'Day of Arafah');
enter into important_dates values( '10 Dhuʻl-Hijjah', 'Eid ul Azha');