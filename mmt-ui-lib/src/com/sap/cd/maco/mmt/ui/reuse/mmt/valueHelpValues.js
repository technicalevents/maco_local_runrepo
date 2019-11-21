sap.ui.define([], function() {
  'use strict';

  return {
    partnerSyncStatuses: [{ id: '01', text: 'Initial' }, { id: '02', text: 'Fail' }, { id: '03', text: 'Success' }],
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
    beConnectionTypes: [{ id: '', text: '' }, { id: 'On-Premise', text: 'On-Premise' }],
    extConnectionTypes: [{ id: '', text: '' }, { id: 'Email', text: 'Email' }, { id: 'AS2', text: 'AS2' }],
    emailProtocols: [{ id: '', text: '' }, { id: 'POP3', text: 'POP3' }, { id: 'IMAP', text: 'IMAP' }],
    emailConnStatus: [{ id: '', text: '' }, { id: '01', text: 'Not Maintained' }, { id: '02', text: 'Maintained' }],
    keyPairStatus: [
      { id: '', text: '' },
      { id: '01', text: 'Valid ' },
      { id: '02', text: 'InValid Soon' },
      { id: '03', text: 'InValid' },
      { id: '04', text: 'Valid In Future' },
      { id: '05', text: 'Not Maintaind' }
    ],
    beConnectionStatus: [{ id: '', text: '' }, { id: '01', text: 'Not Maintained' }, { id: '02', text: 'Maintained' }],
    ProtectforRevEmail: [
      { id: '01', text: 'Off' },
      { id: '02', text: 'POP3S' },
      { id: '03', text: 'IMAPS' },
      { id: '04', text: 'STARTTTLS Mandatory' },
      { id: '05', text: 'STARTTTLS Optional' }
    ],
    ProtectforSendEmail: [
      { id: '01', text: 'Off' },
      { id: '02', text: 'SMTPS' },
      { id: '03', text: 'STARTTTLS Mandatory' },
      { id: '04', text: 'STARTTTLS Optional' }
    ],
    AuthforRevEmail: [{ id: '01', text: 'Plain User Name/Password' }, { id: '02', text: 'Encrypted User/Password' }],
    AuthforSendEmail: [{ id: '01', text: 'None' }, { id: '02', text: 'Plain User Name/Password' }, { id: '03', text: 'Encrypted User/Password' }]
  };
});
