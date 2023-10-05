// Usage: node build-json-schema.js
const populationTypes = [
  'tg',
  'msm',
  'agyw',
  'mhr',
  'fsw',
  'pwid',
  'ow',
  'sc',
  'pbfw'
];

maleOnlyPopulationTypes = [3, 4];
femaleOnlyPopulationTypes = [2, 5, 9, 7];

// const populationTypes = ['sc', 'pbfw'];

const ageGroups = [
  '15_19',
  '20_24',
  '25_29',
  '30_34',
  '35_39',
  '40_44',
  '45_49',
  '50_54',
  '55_59',
  '60_64',
  'above_65'
];
const genders = ['male', 'female'];

const subPopulationTypes = ['msm', 'fsw', 'pwid', 'tg'];

checkForCompability = (population_type, gender) => {
  if (gender === 'male') {
    if (femaleOnlyPopulationTypes.includes(population_type)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if (maleOnlyPopulationTypes.includes(population_type)) {
      return -1;
    } else {
      return 1;
    }
  }
};

//const

const generateExpression = (data) => {
  if (checkForCompability(data.populationType, data.gender) === -1) {
    return `if((pd.person_id is not null), -1, NULL)`;
  } else {
    if (data.isOldPop) {
      return `if((pd.${data.column} = '${
        data.value
      }' AND (pd.population_type = ${
        data.populationType
      } OR pd.old_population_type = ${
        data.oldPopulationType
      } ) AND pd.gender = '${getGender(data.gender)}' AND (pd.age ${
        data.ageGroup
      })), ${checkForCompability(data.populationType, data.gender)}, NULL)`;
    } else if (data.isSubPop) {
      return `if((pd.${data.column} = '${
        data.value
      }' AND (pd.population_type = ${data.populationType} OR ${
        data.subPopulationType
      }) AND pd.gender = '${getGender(data.gender)}' AND (pd.age ${
        data.ageGroup
      })), ${checkForCompability(data.populationType, data.gender)}, NULL)`;
    } else {
      return `if((pd.${data.column} = '${
        data.value
      }' AND pd.population_type = ${
        data.populationType
      } AND pd.gender = '${getGender(data.gender)}' AND (pd.age ${
        data.ageGroup
      })), ${checkForCompability(data.populationType, data.gender)}, NULL)`;
    }
  }
};

const getPopulationType = (populationType) => {
  switch (populationType) {
    case 'tg':
      return 1;
    case 'agyw':
      return 2;
    case 'msm':
      return 3;
    case 'mhr':
      return 4;
    case 'fsw':
      return 5;
    case 'pwid':
      return 6;
    case 'ow':
      return 7;
    case 'sc':
      return 8;
    case 'pbfw':
      return 9;
    default:
      return 0;
  }
};

const getGender = (gender) => {
  return gender === 'male' ? 'M' : 'F';
};

const getAgeGroup = (ageGroup) => {
  switch (ageGroup) {
    case '15_19':
      return 'between 15 AND 19';
    case '20_24':
      return 'between 20 AND 24';
    case '25_29':
      return 'between 25 AND 29';
    case '30_34':
      return 'between 30 AND 34';
    case '35_39':
      return 'between 35 AND 39';
    case '40_44':
      return 'between 40 AND 44';
    case '45_49':
      return 'between 45 AND 49';
    case '50_54':
      return 'between 50 AND 54';
    case '55_59':
      return 'between 55 AND 59';
    case '60_64':
      return 'between 60 AND 64';
    case 'above_65':
      return '> 65';
    default:
      return 0;
  }
};

const getOldPopulationType = (population) => {
  if (population === 'mhr' || population === 'ow') {
    return 300;
  } else if (population === 'sc') {
    return 100;
  }
};

const getSubPopulationType = (population) => {
  ///'msm', 'fsw', 'pwid', 'tg'
  switch (population) {
    case 'msm':
      return `pd.sub_population_type = 10 OR pd.sub_population_type = 20`;
    case 'fsw':
      return `pd.sub_population_type = 30`;
    case 'pwid':
      return `pd.sub_population_type = 40`;
    case 'tg':
      return `pd.sub_population_type = 50 OR pd.sub_population_type = 60`;
    default:
      return ``;
  }
};

const generateTotalExpression = (data) => {
  if (data.isOldPop) {
    return `if((pd.${data.column} = '${data.value}' AND (pd.population_type=${data.populationType} OR pd.old_population_type=${data.oldPopulationType})), 1, NULL)`;
  } else if (data.isSubPop) {
    return `if((pd.${data.column} = '${data.value}' AND (pd.population_type=${data.populationType} OR ${data.subPopulationType})), 1, NULL)`;
  } else {
    return `if((pd.${data.column} = '${data.value}' AND pd.population_type = ${data.populationType}), 1, NULL)`;
  }
};

/**
 * @param {database column} column
 * @returns An array of derived columns
 */
const generateColumns = (column, value, alias) => {
  let columns = [];

  for (let pt of populationTypes) {
    for (let ag of ageGroups) {
      for (let g of genders) {
        columns.push({
          type: 'derived_column',
          alias: `${alias}_${pt}_${ag}_${g}`,
          expressionType: 'simple_expression',
          expressionOptions: {
            expression: generateExpression({
              column: column,
              populationType: getPopulationType(pt),
              gender: g,
              value: value,
              ageGroup: getAgeGroup(ag),
              isOldPop: pt === 'ow' || pt === 'mhr' || pt === 'sc',
              isSubPop: subPopulationTypes.includes(pt),
              oldPopulationType: getOldPopulationType(pt),
              subPopulationType: getSubPopulationType(pt)
            })
          }
        });
      }
    }
    // Add total column
    columns.push({
      type: 'derived_column',
      alias: `total_${alias}_${pt}`,
      expressionType: 'simple_expression',
      expressionOptions: {
        expression: generateTotalExpression({
          isOldPop: pt === 'ow' || pt === 'mhr' || pt === 'sc',
          isSubPop: subPopulationTypes.includes(pt),
          oldPopulationType: getOldPopulationType(pt),
          subPopulationType: getSubPopulationType(pt),
          populationType: getPopulationType(pt),
          column: column,
          value: value
        })
      }
    });
  }

  return columns;
};

const generateAggregate = (alias) => {
  let aggregates = [];
  for (let pt of populationTypes) {
    for (let ag of ageGroups) {
      for (let g of genders) {
        aggregates.push({
          type: 'simple_column',
          alias: `${alias}_${pt}_${ag}_${g}`,
          column: `sum(b.${alias}_${pt}_${ag}_${g})`
        });
      }
    }
    // Add total column
    aggregates.push({
      type: 'simple_column',
      alias: `total_${alias}_${pt}`,
      column: `sum(b.total_${alias}_${pt})`
    });
  }
  return aggregates;
};

const aggsSchema = generateAggregate('edp');
const aggs = JSON.stringify(aggsSchema, null, 2);
