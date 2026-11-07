// CODIGO TELA ServicosADM
import React, { useState, useCallback } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert,ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { API_URL } from '@/constants/config-API';

interface Servico {
  id: number;
  nome: string;
  preco: string;
}

export default function ServicosADMScreen() {
  const router = useRouter();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para atualização de preços (armazenados por ID do serviço)
  const [precosEditados, setPrecosEditados] = useState<{ [key: number]: string }>({});

  // Estado para novo serviço
  const [novoNomeServico, setNovoNomeServico] = useState('');

  // IDs dos serviços marcados para exclusão
  const [idsParaExcluir, setIdsParaExcluir] = useState<number[]>([]);

  // Busca os serviços do servidor sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      buscarServicos();
    }, [])
  );

  const buscarServicos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/servicos`);
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços do servidor.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExcluir = (id: number) => {
    if (idsParaExcluir.includes(id)) {
      setIdsParaExcluir(idsParaExcluir.filter((item) => item !== id));
    } else {
      setIdsParaExcluir([...idsParaExcluir, id]);
    }
  };

  const handlePrecoChange = (id: number, valor: string) => {
    setPrecosEditados({
      ...precosEditados,
      [id]: valor,
    });
  };

  const handleSalvar = async () => {
    try {
      // 1. Excluir serviços marcados
      for (const id of idsParaExcluir) {
        await fetch(`${API_URL}/servicos/${id}`, {
          method: 'DELETE',
        });
      }

      // 2. Atualizar preços modificados
      for (const [idStr, preco] of Object.entries(precosEditados)) {
        if (preco.trim() !== '') {
          await fetch(`${API_URL}/servicos/${idStr}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preco: preco.trim() }),
          });
        }
      }

      // 3. Adicionar novo serviço se preenchido
      if (novoNomeServico.trim() !== '') {
        await fetch(`${API_URL}/servicos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: novoNomeServico.trim().toUpperCase(),
            preco: '0',
          }),
        });
      }

      Alert.alert('Sucesso', 'Serviços atualizados com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as alterações no servidor.');
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>GERENCIAR SERVIÇOS</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Lista de Serviços do Banco */}
          {servicos.map((servico) => {
            const marcadoExcluir = idsParaExcluir.includes(servico.id);

            return (
              <View key={servico.id} style={styles.cardSecao}>
                <Text style={styles.subtituloSecao}>{servico.nome}</Text>

                <View style={styles.linhaAcao}>
                  <TextInput
                    style={styles.inputAtualizar}
                    placeholder={`ATUALIZAR R$ (Atual: ${servico.preco})`}
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                    value={precosEditados[servico.id] || ''}
                    onChangeText={(valor) => handlePrecoChange(servico.id, valor)}
                  />

                  <TouchableOpacity
                    style={[styles.btnExcluirLateral, marcadoExcluir && styles.btnExcluirAtivo]}
                    onPress={() => toggleExcluir(servico.id)}
                  >
                    <Text style={[styles.textoExcluirItem, marcadoExcluir && styles.textoExcluirAtivo]}>
                      {marcadoExcluir ? '✓ EXCLUIR' : 'EXCLUIR'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* Adicionar Novo Serviço na Parte Inferior */}
          <View style={styles.cardSecao}>
            <Text style={styles.subtituloSecao}>NOVO SERVIÇO</Text>

            <TextInput
              style={styles.inputCompleto}
              placeholder="DIGITE O NOME"
              placeholderTextColor="#666666"
              value={novoNomeServico}
              onChangeText={setNovoNomeServico}
            />
          </View>
        </ScrollView>
      )}

      {/* Botões do Rodapé */}
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
    gap: 10,
  },
  subtituloSecao: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1,
  },
  linhaAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputAtualizar: {
    flex: 1,
    backgroundColor: '#121212',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputCompleto: {
    backgroundColor: '#121212',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  btnExcluirLateral: {
    backgroundColor: '#221212',
    borderWidth: 1,
    borderColor: '#552222',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
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