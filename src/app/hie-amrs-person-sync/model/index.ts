import { Patient } from '../../models/patient.model';
import { HieClient } from '../../models/hie-registry.model';

export interface ClientAmrsPatient {
  client: HieClient;
  patient: Patient;
}
