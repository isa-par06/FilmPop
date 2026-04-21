import { AveriaSerifLibre_400Regular, AveriaSerifLibre_700Bold } from '@expo-google-fonts/averia-serif-libre';
import { FascinateInline_400Regular, useFonts } from '@expo-google-fonts/fascinate-inline';
import { Inter_400Regular, Inter_400Regular_Italic, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

//prevents the splash screen from auto-hiding while we load in the font
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  //used to load in the main font, plus it keeps the splash screen until the font is fully loaded (font from google btw)
  const [loaded, error] = useFonts({
    FascinateInline_400Regular,
    Inter_700Bold,
    Inter_400Regular,
    Inter_400Regular_Italic,
    AveriaSerifLibre_400Regular,
    AveriaSerifLibre_700Bold,
  });

  //hides the splash screen once the font is loaded or if there is an error loading the font
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  //prevents UI from rendering before the font is loaded
  if (!loaded && !error) {
    return null;
  }

  return <Stack screenOptions={{headerShown:false, animation: 'none'}}/>;
}
