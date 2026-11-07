// CODIGO TELA PAINEL DO CLIENTE
import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/config-API';


export default function ClienteHomeScreen() {
  const router = useRouter();
  const [mensagemFila, setMensagemFila] = useState('CONSULTANDO FILA...');

  // useEffect Consulta a fila toda vez que a tela é aberta
  useEffect(() => {
    consultarFila();
  }, []);

  const consultarFila = async () => {
    try {
      const dadosArmazenados = await AsyncStorage.getItem('@agendamento_cliente');
      
      const resposta = await fetch(`${API_URL}/fila`);
      const fila = await resposta.json();

      if (!dadosArmazenados) {
        setMensagemFila(`${fila.length} PESSOAS AGUARDANDO`);
        return;
      }

      const clienteAtual = JSON.parse(dadosArmazenados);
      const posicaoIndex = fila.findIndex((item: { id: number }) => item.id === clienteAtual.id);

      if (posicaoIndex === -1) {
        setMensagemFila('SEM AGENDAMENTO NA FILA');

      } else if (posicaoIndex === 0) {
        setMensagemFila('VOCÊ É O PRÓXIMO DA FILA!');
        
      } else {
        setMensagemFila(`${posicaoIndex} PESSOAS NA SUA FRENTE!`);
       
      }
    } catch (error) {
      setMensagemFila('FILA INDISPONÍVEL');
      
    }
  };
// ==================================================================================================================================
  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>SEJA BEM-VINDO</Text>
      </View>

      {/* Área de Avisos Dinâmicos */}
      <View style={styles.avisosContainer}>

        <View style={styles.cardAviso}>
          <Text style={styles.avisoTexto}>{mensagemFila}</Text>
        </View>

      </View>

      {/* BOTOES DE ACAO */}
      <View style={styles.acoesContainer}>
        <TouchableOpacity 
          style={styles.botaoPrincipal} 
          onPress={() => router.push('/cliente/agendar')}
        >
          <Text style={styles.textoBotao}>AGENDAR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botaoPrincipal} 
          onPress={() => router.push('/cliente/servicos')}
        >
          <Text style={styles.textoBotao}>SERVIÇOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={() => router.push('/cliente/meus-agendamentos')}
        >
          <Text style={styles.textoBotao}>MEU AGENDAMENTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
                      style={styles.btnSair}
                      onPress={() => router.replace('/')}
                    >
                      <Text style={styles.btnSairTexto}>SAIR</Text>
                    </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 16,
    color: '#E0E0E0',
    marginTop: 6,
    fontWeight: '600',
  },
  avisosContainer: {
    gap: 16,
    marginVertical: 20,
  },
  cardAviso: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: '#D4AF37',//borda laranja em volta do 'tantas pessoas na sua frente'
    alignItems: 'center',
  },
  avisoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  acoesContainer: {
    gap: 14,
    marginBottom: 20,
  },
  botaoPrincipal: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  btnSair: {
    backgroundColor: '#4A1515',
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7A2020',
  },
  btnSairTexto: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});