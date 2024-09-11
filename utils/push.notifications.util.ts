// import admin from 'firebase-admin'
// const serviceAccount = require('../../config/app/firebase_service_account_key.json');

// export default class PushNotificationsHandler
// {
//   constructor() { }

//   public async sendNotification(userDeviceToken: string, subject: string, message: string)
//   {
//     try {
//       admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

//       const payload = {
//         notification: {
//           title: subject,
//           body: message,
//         },
//         token: userDeviceToken,
//       };

//       admin.messaging().send(payload).then((response) => {
//         console.log('Successfully sent notification:', response);
//       }).catch((error) => {
//         console.log('Error sending notification:', error);
//       });

//     } catch (error) {
//       throw error;
//     }

//     return true;
//   }
// }
