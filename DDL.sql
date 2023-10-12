DROP TABLE PROFILE;
DROP TABLE CREDENTIALS;

CREATE TABLE CREDENTIALS 
(
  USER_ID BIGINT AUTO_INCREMENT,
  EMAIL VARCHAR(30),
  PASSWORD_HASH VARCHAR(64),
  CONSTRAINT CREDENTIALS_PK PRIMARY KEY(USER_ID),
  CONSTRAINT CREDENTIALS_UNIQ UNIQUE (EMAIL)
);

CREATE TABLE PROFILE
(
  USER_ID BIGINT,
  FIRST_NAME VARCHAR(20) NOT NULL ,
  LAST_NAME VARCHAR(20),
  GENDER TINYINT, # 1 for male, 0 for female
  COUNTRY VARCHAR(20),
  CONSTRAINT PROFILE_PK PRIMARY KEY(USER_ID),
  CONSTRAINT PROFILE_FK FOREIGN KEY(USER_ID) REFERENCES CREDENTIALS(USER_ID)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE TABLE CLASSES (
  POST_ID BIGINT AUTO_INCREMENT,
  TOPIC VARCHAR(100),
  TEACHER VARCHAR(100),
  DATE DATE,
  TIME TIME,
  ONLINE TINYINT, #ONLY 0 OR 1
  ADDRESS VARCHAR(100),
  CONSTRAINT CLASSES_PK PRIMARY KEY (POST_ID)
);
