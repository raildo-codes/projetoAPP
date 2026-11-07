// LAYOUT GLOBAL ONDE CENTRALIZO ALGUNS IMPORTs
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'; 

export default function RootLayout() {
  return (
    // SafeAreaView evita o visual, botões nunca fiquem escondidos debaixo da câmara ou barras superio/inferiodo sistema
    // fundo global pintando tanto fundo telas as áreas das barras superio/inferio do sistema */}
    <SafeAreaView style={{flex: 1, backgroundColor: '#121214'}}>

     {/* Stack gerencia as telas, contentStyle padroniza o fundo escuro todas telas app,
     controla transição entre as telas, esconde o cabeçalho padrão*/}
     <Stack screenOptions={{headerShown: false, contentStyle: {backgroundColor: '#121212'}}}>
      <Stack.Screen name="index" />
     </Stack>

    </SafeAreaView>
  );
}