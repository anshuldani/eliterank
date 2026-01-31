import { useEffect } from 'react';

export default function PushNotifications({ userId, userEmail }) {
  useEffect(() => {
    if (!userId) return;

    if (typeof window !== 'undefined' && window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.login(userId);
        
        if (userEmail) {
          try {
            await OneSignal.User.addEmail(userEmail);
          } catch (err) {
            console.log('Email already added');
          }
        }
        
        await OneSignal.Slidedown.promptPush();
      });
    }
  }, [userId, userEmail]);

  return null;
}
