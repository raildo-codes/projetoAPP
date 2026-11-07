// CODIGO TELA CLIENTE/SERVICOS
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { API_URL } from '@/constants/config-API';

export default function ServicosScreen() {
  const router = useRouter();
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect executa sempre que o utilizador entra nesta tela
  useFocusEffect(
    useCallback(() => {
      buscarServicos();
    }, [])
  );

  const buscarServicos = async () => {
    try {
      const response = await fetch(`${API_URL}/servicos`);

      const data = await response.json();

      setServicos(data);

    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };
   
// ==================================================================================================================================
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.titulo}>SERVIÇOS DISPONÍVEIS</Text>
        <View style={styles.linhaDivisoria} />
      </View>


      <View style={styles.content}>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" />
        ) : (

          <ScrollView contentContainerStyle={styles.listaContainer}>
            {servicos.map((servico) => (
              <View key={servico.id} style={styles.itemCard}>
                <Text style={styles.itemTexto}>
                  R$ {servico.preco} - {servico.nome}
                </Text>
              </View>
            ))}
          </ScrollView>

        )}
      </View>

      <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
        <Text style={styles.btnTextVoltar}>VOLTAR</Text>
      </TouchableOpacity>

    </View>
  );
}
// ============================================================================================================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    
    padding: 20,
  },

  content: {
    flex: 1,
  },

  header: {
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 20,
  },

  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1.5,
    marginBottom: 10, // Espaço entre o texto e a linha
  },

  linhaDivisoria: {
    width: '100%',      // Faz a linha ocupar toda a largura útil
    height: 1,          // Espessura da linha
    backgroundColor: '#2D2D2D', // Cor sutil da linha
  },

  listaContainer: {
    gap: 12,
  },
  
  itemCard: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  itemTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  btnVoltar: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#D4AF37', marginTop: 10 },
  btnTextVoltar: { color: '#D4AF37', fontWeight: 'bold', fontSize: 15 },
});