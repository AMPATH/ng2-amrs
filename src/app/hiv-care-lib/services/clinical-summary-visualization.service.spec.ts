import { ClinicalSummaryVisualizationService } from './clinical-summary-visualization.service';

describe('Service : ClinicalSummaryVisualizationService', () => {
  let service: ClinicalSummaryVisualizationService;
  const expectedCols = {
    'clinical-hiv-comparative-overview': {
      'reporting_month': 'Reporting Month',
      'currently_in_care_total': 'Patients In Care',
      'on_art_total': 'Patients On ART',
      'not_on_art_total': 'Patients Not On ART',
      'patients_requiring_vl': 'Patients Qualified For VL',
      'tested_appropriately': 'On ART with VL',
      'not_tested_appropriately': 'On ART without VL',
      'due_for_annual_vl': 'Due For Annual VL',
      'pending_vl_orders': 'Ordered & Pending VL Result',
      'missing_vl_order': 'Missing VL Order',
      'virally_suppressed': 'Virally Suppressed',
      'perc_virally_suppressed': '% Virally Suppressed',
      'perc_tested_appropriately': '% on ART with VL',
      'not_virally_suppressed': 'Not Virally Suppressed'
    },
    'clinical-art-overview': {
      'not_on_arv': 'Not On Any ARV Drugs',
      'on_nevirapine': 'Nevirapine',
      'on_efavirenz': 'Efavirenz',
      'on_lopinavir': 'Lopinavir',
      'on_atazanavir': 'Atazanavir',
      'on_raltegravir': 'Raltegravir',
      'on_other_arv_drugs': 'Others'
    },
    'clinical-patient-care-status-overview': {
      'patients_continuing_care': 'Patients In Care',
      'transferred_out_patients': 'Transferred Out Patients',
      'deceased_patients': 'Deceased Patients',
      'untraceable_patients': 'Untraceable Patients',
      'hiv_negative_patients': 'HIV Negative Patients',
      'self_disengaged_from_care': 'Self Disengaged From Care',
      'defaulters': 'Defaulters',
      'other_patient_care_status': 'Others'
    }
  };

  const tableData = [{'t': 1}];

  beforeEach(() => {
    service = new ClinicalSummaryVisualizationService();
  });

  it('should generate the correct columns when translateColumns is called', (done) => {
    expect(service.translateColumns).toEqual(expectedCols);
    done();
  });

  it('should return table data when generateTableData is called', (done) => {
    expect(service.generateTableData(tableData)).toEqual(tableData);
    done();
  });

  it('should be able to flip table columns when flipTranlateColumns is called', (done) => {
    const flippedCols = service.flipTranlateColumns;
    expect(flippedCols['clinical-art-overview']['Raltegravir']).toEqual('on_raltegravir');
    done();
  });

  it('should be able to add onCellClicked and cellRenderer when generateTabularViewColumns' +
    ' is called', (done) => {
    const tableCols = service.generateTabularViewColumns;
    expect(tableCols[0].onCellClicked).toBeDefined();
    done();
  });



});
