create table if not exists motd_messages (
   message_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   title varchar(100),
   message varchar(100),
   startDate datetime DEFAULT NOT NULL,
   expireTime datetime DEFAULT NOT NULL,
   alert_interval smallInt(6) NOT NULL,
   dateCreated datetime NULL,
   alert_type smallInt(6)
);
