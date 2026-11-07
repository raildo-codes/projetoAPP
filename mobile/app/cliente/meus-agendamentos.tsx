// CODIGO TELA CLIENTE/MEUS AGENDAMENTOS
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/config-API';

interface AgendamentoCliente {
  id: number;
  nome: string;
  barbeiro: string;
  horario: string;
  dia?: string; 
  //servico?: string;
  status?: string;
}

export default function MeusAgendamentosScreen() {
  const router = useRouter();
  const [agendamento, setAgendamento] = useState<AgendamentoCliente | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarAgendamento();
  }, []);

  const carregarAgendamento = async () => {
    try {
      setCarregando(true);
      const dadosArmazenados = await AsyncStorage.getItem('@agendamento_cliente');

      if (dadosArmazenados) {
        const item: AgendamentoCliente = JSON.parse(dadosArmazenados);

        // Busca na fila do servidor para confirmar dados atualizados (como status ou dia)
        const resposta = await fetch(`${API_URL}/fila`);
        const fila = await resposta.json();
        const encontradoNaFila = fila.find((f: { id: number }) => f.id === item.id);

        if (encontradoNaFila) {
          setAgendamento({
            ...item,
            status: encontradoNaFila.status,
            //servico: encontradoNaFila.servico,
            dia: encontradoNaFila.dia || item.dia,
          });

        } else {
          setAgendamento(item);
        }
      } else {
        setAgendamento(null);
      }
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => {
    if (!agendamento) return;

    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar o seu agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Atualiza no backend SQLite para status 'cancelado'
              await fetch(`${API_URL}/agendamentos/${agendamento.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelado' }),
              });

              // 2. Remove do armazenamento local do telemóvel
              await AsyncStorage.removeItem('@agendamento_cliente');
              setAgendamento(null);

              Alert.alert('Cancelado', 'O seu agendamento foi cancelado com sucesso.', [
                { text: 'OK', onPress: () => router.push('/cliente') },
              ]);
            } 
            
            catch (error) {
              Alert.alert('Erro', 'Não foi possível cancelar o agendamento');
            }
          },
        },
      ]
    );
  };
  
// ==================================================================================================================================
  return (
    <View style={styles.container}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>MEU AGENDAMENTO</Text>
      </View>

      {/* Conteúdo Central */}
      <View style={styles.content}>
        {carregando ? (
          <ActivityIndicator size="large" color="#D4AF37" />
         ) : agendamento ? (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>DETALHES DO AGENDAMENTO</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CLIENTE:</Text>
              <Text style={styles.infoValue}>{agendamento.nome.toUpperCase()}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>BARBEIRO:</Text>
              <Text style={styles.infoValue}>{agendamento.barbeiro.toUpperCase()}</Text>
            </View>

            {/* ➔ ADICIONADO NO JSX: Linha que exibe o Dia da Semana na tela */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>DIA:</Text>
              <Text style={styles.infoValue}>
                {agendamento.dia ? agendamento.dia.toUpperCase() : 'NÃO INFORMADO'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>HORÁRIO:</Text>
              <Text style={styles.infoValue}>{agendamento.horario}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ESTADO:</Text>
              <Text style={[styles.infoValue, styles.statusAtivo]}>
                {agendamento.status ? agendamento.status.toUpperCase() : 'AGUARDANDO'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.cardVazio}>
            <Text style={styles.textoVazio}>Nenhum agendamento encontrado.</Text>
          </View>
        )}
      </View>

      {/* Botões de Ação no Rodapé */}
      <View style={styles.footer}>
        {agendamento && (
          <TouchableOpacity style={styles.btnCancelar} onPress={handleCancelar}>
            <Text style={styles.btnTextCancelar}>CANCELAR AGEND.</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
          <Text style={styles.btnTextVoltar}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================================================================================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    gap: 14,
  },
  cardHeader: {
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    paddingBottom: 8,
  },
  infoLabel: {
    color: '#888888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusAtivo: {
    color: '#00FF66',
    fontWeight: 'bold',
  },
  cardVazio: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  textoVazio: {
    color: '#888888',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    gap: 12,
    marginBottom: 16,
  },
  btnCancelar: {
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTextCancelar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  btnVoltar: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444444',
  },
  btnTextVoltar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});