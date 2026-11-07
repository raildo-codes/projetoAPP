// CODIGO TELA BARBEIROS
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { API_URL } from '@/constants/config-API';

interface Barbeiro {
  id: number;
  nome: string;
}

export default function BarbeirosScreen() {
  const router = useRouter();

  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [novoNomeBarbeiro, setNovoNomeBarbeiro] = useState('');
  const [idsParaExcluir, setIdsParaExcluir] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      buscarBarbeiros();
    }, [])
  );

  const buscarBarbeiros = async () => {
    try {
      const response = await fetch(`${API_URL}/barbeiros`);
      const data = await response.json();
      setBarbeiros(data);
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os barbeiros.');
    }
  };

  const toggleExcluir = (id: number) => {
    if (idsParaExcluir.includes(id)) {
      setIdsParaExcluir(idsParaExcluir.filter((item) => item !== id));
    } else {
      setIdsParaExcluir([...idsParaExcluir, id]);
    }
  };

  const handleSalvar = async () => {
    try {
      for (const id of idsParaExcluir) {
        await fetch(`${API_URL}/barbeiros/${id}`, {
          method: 'DELETE',
        });
      }

      if (novoNomeBarbeiro.trim() !== '') {
        await fetch(`${API_URL}/barbeiros`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: novoNomeBarbeiro.trim().toUpperCase(),
          }),
        });
      }

      setNovoNomeBarbeiro('');
      setIdsParaExcluir([]);

      Alert.alert('Sucesso', 'Barbeiros atualizados com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao comunicar com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>GERENCIAR BARBEIROS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardSecao}>
          <Text style={styles.labelSecao}>NOME BARBEIRO</Text>

          {barbeiros.map((barbeiro) => {
            const marcadoExcluir = idsParaExcluir.includes(barbeiro.id);

            return (
              <View key={barbeiro.id} style={styles.barbeiroLinhaHorizontal}>
                <View style={styles.dropdownBox}>
                  <Text style={styles.textoDropdown}>{barbeiro.nome}</Text>
                </View>

                <TouchableOpacity 
                  style={[styles.btnExcluirLateral, marcadoExcluir && styles.btnExcluirAtivo]}
                  onPress={() => toggleExcluir(barbeiro.id)}
                >
                  <Text style={[styles.textoExcluirItem, marcadoExcluir && styles.textoExcluirAtivo]}>
                    {marcadoExcluir ? '✓ EXCLUIR' : 'EXCLUIR'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View style={styles.cardSecao}>
          <Text style={styles.subtituloSecao}>NOVO BARBEIRO</Text>
          
          <TextInput
            style={styles.input}
            placeholder="DIGITE O NOME"
            placeholderTextColor="#666666"
            value={novoNomeBarbeiro}
            onChangeText={setNovoNomeBarbeiro}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
          <Text style={styles.btnTextoVoltar}>VOLTAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
          <Text style={styles.btnTextoSalvar}>SALVAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
// ============================================================================================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
    paddingBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 16,
  },
  cardSecao: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    gap: 12,
  },
  labelSecao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtituloSecao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  barbeiroLinhaHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownBox: {
    flex: 1,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  textoDropdown: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnExcluirLateral: {
    backgroundColor: '#221212',
    borderWidth: 1,
    borderColor: '#552222',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnExcluirAtivo: {
    backgroundColor: '#882222',
    borderColor: '#FF4444',
  },
  textoExcluirItem: {
    color: '#FF6666',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textoExcluirAtivo: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#121212',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  btnVoltar: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  btnTextoVoltar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnSalvar: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnTextoSalvar: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});