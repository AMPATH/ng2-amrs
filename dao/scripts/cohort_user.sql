create table if not exists cohort_user (
   cohort_user_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   cohort_id int(11),
   user_id int(11),
   role varchar(100),
   creator int(11) DEFAULT NULL,
   date_created datetime DEFAULT NULL,
   changed_by int(11) DEFAULT NULL,
   date_changed datetime DEFAULT NULL,
   voided tinyint(1) NOT NULL DEFAULT '0',
   voided_by int(11) DEFAULT NULL,
   date_voided datetime DEFAULT NULL,
   void_reason varchar(255) DEFAULT NULL
);
