create table if not exists patient_referral (
   patient_referral_id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
   encounter_id int(11),
   provider_id int(11),
   patient_program_id int(11),
   patient_program_id int(11),
   referred_to_location_id int(11),
   referred_from_location_id int(11),
   program_workflow_state_id int(11),
   creator int(11) DEFAULT NULL,
   date_created datetime DEFAULT NULL,
   changed_by int(11) DEFAULT NULL,
   date_changed datetime DEFAULT NULL,
   voided tinyint(1) NOT NULL DEFAULT '0',
   voided_by int(11) DEFAULT NULL,
   date_voided datetime DEFAULT NULL,
   void_reason varchar(255) DEFAULT NULL
);