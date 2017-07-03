create table if not exists cohort_user (
   cohort_id int(11),
   user_id int(11),
   role varchar(100),
   voided tinyint(1) NOT NULL DEFAULT '0',
   voided_by int(11) DEFAULT NULL,
   date_voided datetime DEFAULT NULL,
   void_reason varchar(255) DEFAULT NULL
);