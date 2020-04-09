sap.ui.define([], function() {
  'use strict';

  return {
    divisions: [
      { id: '', text: '' }, // empty value
      { id: '01', text: 'Electricity' },
      { id: '02', text: 'Gas' }
    ],
    marketRoles: [
      { id: '', text: '' }, // empty value
      { id: 'BIKO', text: 'Settlement Coordinator' },
      { id: 'NB', text: 'Distributor' },
      { id: 'LF', text: 'Supplier' },
      { id: 'MSB', text: 'Meter Operator' },
      { id: 'RB-HKN-R', text: 'Environment Agency' },
      { id: 'UNB', text: 'Transmission Network Operator' },
      { id: 'MGV', text: 'Party Responsible for Settlement (Gas)' },
      { id: 'BKV', text: 'Party Responsible for Settlement (Ele)' }
    ]
  };
});
