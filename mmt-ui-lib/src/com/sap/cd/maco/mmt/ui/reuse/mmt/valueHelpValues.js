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
    ],
    fileContentTypes: [
      { id: '', text: '' }, // empty value
      { id: 'VB', text: 'VB XSD' },
      { id: 'RD', text: 'RD XSD' },
      { id: 'PREXSL', text: 'Preprocess XSL' }
    ],
    beConnectionTypes: [{ id: '', text: '' }, { id: 'On-Premise', text: 'On-Premise' },{ id: 'Internet', text: 'Internet' }],
    extConnectionTypes: [{ id: '', text: '' }, { id: 'Email', text: 'Email' }, { id: 'AS2', text: 'AS2' }],
    emailProtocols: [{ id: '', text: '' }, { id: 'POP3', text: 'POP3' }, { id: 'IMAP', text: 'IMAP' }],
    emailConnStatus: [{ id: '', text: '' }, { id: '01', text: 'Invalid' }, { id: '02', text: 'Valid' }],
    keyPairStatus: [
      { id: '', text: '' },
      { id: '01', text: 'Valid' },
      { id: '02', text: 'Invalid Soon' },
      { id: '03', text: 'Invalid' },
      { id: '04', text: 'Valid in Future' },
      { id: '05', text: 'Not Maintained' }
    ],
    beConnectionStatus: [{ id: '', text: '' }, { id: '01', text: 'Invalid' }, { id: '02', text: 'Valid' }]
  };
});
