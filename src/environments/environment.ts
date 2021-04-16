// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


/**************************************************** */
/*           GLOBAL CONFIGURATION PARAMETERS          */
/**************************************************** */

export const environment = {
  production: false
};

export const BOT_DATA_URL = 'https://devzurichchatbot.blob.core.windows.net/zurich-resources/bot_data.json';

export const evaConstants = {

  BOT_NAME: 'Johanna de Zurich Colombia',
  BACKGROUND: '#003399',
  IMAGE: {
    DEFAULT: 'https://devzurichchatbot.blob.core.windows.net/zurich-resources/avatar-default.png',
    AWAKE: '/assets/img/avatar-awake.jpg',
    SLEEP: 'https://devzurichchatbot.blob.core.windows.net/zurich-resources/avatar-sleeping.png',
    THANK_YOU: 'https://devzurichchatbot.blob.core.windows.net/zurich-resources/avatar-thank-you.png'
  },

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'API-KEY': '228436ca-0017-4a34-af63-144b8d398e08',
    'PROJECT': 'PICHINCHA',
    'CHANNEL': 'HomeBanking',
    'OS': 'windows',
    'USER-REF': 'fguillee',
    'LOCALE': 'es-ES',
    'OS-VERSION': '10',
    'BROWSER': 'Chrome',
    'BROWSER-VERSION': '10'
  },

  CODES: {
    INIT_CODE: '%EVA_WELCOME_MSG',
    END_CODE: 'END',
    FEEDBACK_CODE: 'ENCUESTA',
    EVENT_END_CODE: 'DESPEDIDA',
    DERIVE_CODE: 'DERIVAR',
    NONE: 'NONE'
  },

  URL: 'https://api-pichincha.eva.bot/conversations'

};

export const LiveChatConstants = {
  apiUrl: 'wss://api.livechatinc.com/v3.1/customer/rtm/ws',
  licenseID: 11714424
};


export const timerConst = {
  SLEEP: 300000,
  END: 1500000
};


/**************************************************** */
/*           BOTS LIST CONFIGURATION                  */
/**************************************************** */

export const botslist = {

  key_bot: {
    
  }

};
