import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3981d9ae082c401388fb7f695a43ea7f',
  appName: 'repetition-369-manifestation-app',
  webDir: 'dist',
  server: {
    url: 'https://3981d9ae-082c-4013-88fb-7f695a43ea7f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F2F2F7',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#F2F2F7',
    },
  },
};

export default config;