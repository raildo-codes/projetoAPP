// CODIGO PRIMEIRA TELA DO APP ONDE ECOLHE COMO DESEJA ACESSAR 
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';// StyleSheet: para criar e otimizar estilos(css reAct), Text: mostrar texto na tela, View: contenie, TouchableOpacity: torna elementos clicavél com efeitos
import { useRouter } from 'expo-router';//chama a tela do cliente, trazendo a função de navegação


export default function IndexScreen() {
  const router = useRouter();//chama a tela do cliente, trazendo a função de navegação
 
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style = {styles.headerTitle}>SISTEMA DE AGENDAMENTO</Text>
      </View>
      
      {/* IMAGEM*/}
      <View style={styles.containerImagem}>
        <Image 
          source={require('@/assets/images/logo-barbearia.png')}
          style={styles.imagemCircular}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
        style={styles.botao} 
        onPress={() => router.push('/cliente')}
       >
        <Text style={styles.textoBotao}>FAÇA SEU AGENDAMENTO</Text>
       </TouchableOpacity>

        <View style={styles.containerAdminLink}>
          <Text style={styles.textoAdminInfo}>Entrar Como Administrador?</Text>
          
          <TouchableOpacity 
            style={styles.botaoAdminCompacto} 
            onPress={() => router.push('/admin')}
          >
            <Text style={styles.textoBotaoAdminCompacto}>ACESSAR</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

// ============================================================================================================================================
const styles = StyleSheet.create({

  containerImagem: {
    alignItems: 'center',    // Centraliza a imagem horizontalmente
    justifyContent: 'center', // Centraliza verticalmente se necessário
    marginVertical: 40,       // Espaço em cima e embaixo da imagem
  },
  imagemCircular: {
    width: 210,          // Largura da imagem
    height: 210,         // Altura (deve ser igual à largura para formar um quadrado perfeito)
    borderRadius: 105,    // Metade da largura/altura para transformar o quadrado num círculo perfeito
    borderWidth: 2,      // Borda opcional em volta
    borderColor: '#D4AF37', // Cor dourada combinando com a identidade da barbearia
  },
  container: {
    flex: 1,
    
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  header: {
    alignItems: 'center',            // Centraliza o texto horizontalmente
    paddingBottom: 16,               // Espaço abaixo do texto
    borderBottomColor: '#2D2D2D',  // Cor sutil da linha (igual à outra tela)
    marginBottom: 20,                // Distância para os elementos abaixo
    marginTop: 150,                   //PARA DESCER O TÍTULO
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',                // Cor dourada padrão
    letterSpacing: 1.5,              // Espaçamento elegante entre as letras
  },

    content: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 16,
    marginTop: 60,
  },

  botao: {
    width: '100%',
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBotao: {
    color: '#121212',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  
// ----------------------------------------------------------------------------------------------------------------------------------
// Caixa horizontal que organiza o texto e o botão do administrador lado a lado com fundo escuro e borda fina
  containerAdminLink: {
    flexDirection: 'row',       // Posiciona os itens na horizontal (lado a lado)
    alignItems: 'center',       // Centraliza verticalmente os itens
    justifyContent: 'space-between', // Espaça o texto para a esquerda e o botão para a direita
      // backgroundColor: '#1E1E1E', // Fundo escuro elegante
      // borderWidth: 1,             // Espessura da borda
      // borderColor: '#2D2D2D',     // Cor sutil da borda
      // borderRadius: 8,            // Arredondamento das pontas
      // paddingVertical: 12,        // Espaçamento interno superior e inferior
    paddingHorizontal: 4,      // Espaçamento interno lateral (esquerda e direita)
    marginTop: 100,              // Distância em relação ao botão de cima
    width: '100%',
  },

  // Estilização do texto informativo do administrador
  textoAdminInfo: {
    color: '#A0A0A0',           // Cor cinza suave e discreta
    fontSize: 15,               // Tamanho compacto da fonte
    flex: 1,
  },

  // Estilização do botão compacto de acesso
  botaoAdminCompacto: {
    backgroundColor: 'transparent', // Fundo transparente para destacar a borda
    borderWidth: 1,                 // Borda fina
    borderColor: '#D4AF37',         // Cor dourada temática da barbearia
    paddingVertical: 6,             // Altura interna compacta do botão
    paddingHorizontal: 10,          // Largura interna confortável para o texto
    borderRadius: 6,                // Cantos levemente arredondados
    alignItems: 'center',           // Centraliza o texto dentro do botão
  },

  // Estilização do texto dentro do botão compacto
  textoBotaoAdminCompacto: {
    color: '#D4AF37',           // Texto na cor dourada
    fontSize: 11,               // Letra pequena e elegante
    fontWeight: 'bold',         // Texto em negrito
    letterSpacing: 0.5,           // Espaçamento sutil entre as letras
  },

});