// CODIGO TELA CLIENTE/AGENDAR
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/config-API';

export default function AgendarScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [diaSelecionado, setDiaSelecionado] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('08:00');
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState('');
  const [barbeirosDisponiveis, setBarbeirosDisponiveis] = useState<any[]>([]);

  const diasDaSemana = [
    { label: 'SEGUNDA', valor: 'segunda' },
    { label: 'TERÇA', valor: 'terça' },
    { label: 'QUARTA', valor: 'quarta' },
    { label: 'QUINTA', valor: 'quinta' },
    { label: 'SEXTA', valor: 'sexta' },
    { label: 'SÁBADO', valor: 'sábado' },
  ];

  const horariosDisponiveis = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '20:00'];

  // useFocusEffect busca os barbeiros do servidor toda vez que a tela de agendamento é aberta
  useFocusEffect(
    useCallback(() => {
      buscarBarbeiros();
    }, [])
  );

  const buscarBarbeiros = async () => {
    try {
      const response = await fetch(`${API_URL}/barbeiros`);
      const data = await response.json();
      setBarbeirosDisponiveis(data);

      if (data.length > 0 && !barbeiroSelecionado) {
        setBarbeiroSelecionado(data[0].nome);
      }
    } catch (error) {
      console.error('Erro ao buscar barbeiros:', error);
    }
  };

  // Função para abrir ou fechar os horários ao clicar no mesmo dia (Toggle)
  const handlePressionarDia = (valorDia: string) => {
    if (diaSelecionado === valorDia) {
      setDiaSelecionado(''); // Se já estava aberto, fecha
    } else {
      setDiaSelecionado(valorDia); // Se estava fechado ou era outro, abre este
    }
  };
  
  const handleConfirmar = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, digite seu nome.');
      return;
    }

    if (!diaSelecionado) {
      Alert.alert('Atenção', 'Por favor, selecione um dia da semana.');
      return;
    }

    try {
      // 1. Envia os dados para a API Node.js salvar no SQLite
      const resposta = await fetch(`${API_URL}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          //servico: 'Corte Cabelo',
          barbeiro: barbeiroSelecionado,
          horario: horarioSelecionado,
          dia: diaSelecionado,
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        Alert.alert('Erro', resultado.erro || 'Falha ao realizar agendamento.');
        return;
      }

      // 2. Salva o ID e dados na memória do celular
      const dadosCliente = {
        id: resultado.id,
        nome: nome.trim(),
        horario: horarioSelecionado,
        barbeiro: barbeiroSelecionado,
        dia: diaSelecionado,
      };
      await AsyncStorage.setItem('@agendamento_cliente', JSON.stringify(dadosCliente));

      Alert.alert('Sucesso!', 'Agendamento registrado', [
        {
          text: 'OK',
          onPress: () => router.push('/cliente'),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>AGENDAMENTO</Text>
        <View style={styles.linhaDivisoria}/>
      </View>
     
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardForm}>
          
          <Text style={styles.labelSecao}>NOME</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite Seu Nome..."
            placeholderTextColor="#777"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.labelSecao}>DIA DA SEMANA E HORÁRIOS</Text>
          
          {/* LISTA DE DIAS COM COMPORTAMENTO DE ABRE/FECHA */}
          <View style={styles.grupoOpcoes}>
            {diasDaSemana.map((item) => {
              const isDiaSelecionado = diaSelecionado === item.valor;

              return (
                <View key={item.valor} style={styles.blocoDiaContainer}>
                  {/* BOTÃO DO DIA DA SEMANA */}
                  <TouchableOpacity
                    style={[styles.botaoDiaAcordeon, isDiaSelecionado && styles.botaoDiaAcordeonSelecionado]}
                    onPress={() => handlePressionarDia(item.valor)}
                  >
                    <Text style={[styles.textoDiaAcordeon, isDiaSelecionado && styles.textoDiaAcordeonSelecionado]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>

                  {/* BLOCO COMPACTO DE HORÁRIOS EM GRADE (CHIPS) */}
                  {isDiaSelecionado && (
                    <View style={styles.containerHorariosInterno}>
                      <Text style={styles.subtituloHorarios}>SELECIONE O HORÁRIO:</Text>
                      
                      <View style={styles.gridHorarios}>
                        {horariosDisponiveis.map((hora) => {
                          const isHoraSelecionada = horarioSelecionado === hora;

                          return (
                            <TouchableOpacity
                              key={hora}
                              style={[styles.chipHorario, isHoraSelecionada && styles.chipHorarioSelecionado]}
                              onPress={() => setHorarioSelecionado(hora)}
                            >
                              <Text style={[styles.textoChipHorario, isHoraSelecionada && styles.textoChipHorarioSelecionado]}>
                                {hora}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* BARBEIROS */}
          <Text style={styles.labelSecao}>BARBEIROS</Text>
          <View style={styles.grupoOpcoes}>
            {barbeirosDisponiveis.map((barb) => {
              const isSelected = barbeiroSelecionado === barb.nome;

              return (
                <TouchableOpacity
                  key={barb.id}
                  style={styles.opcaoItem}
                  onPress={() => setBarbeiroSelecionado(barb.nome)}
                >
                  <View style={[styles.radioCirculo, isSelected && styles.radioCirculoSelecionado]}>
                    {isSelected && <View style={styles.radioPonto} />}
                  </View>
                  
                  <Text style={[styles.opcaoTexto, isSelected && styles.opcaoTextoSelecionado]}>
                    {barb.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.btnConfirmar} onPress={handleConfirmar}>
          <Text style={styles.btnTextConfirmar}>SALVAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnVoltar} onPress={() => router.back()}>
          <Text style={styles.btnTextVoltar}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ==================================================================================================================================
const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#D4AF37', 
    textAlign: 'center', 
    letterSpacing: 1.2,
  },
   container: { flex: 1,
   
   padding: 20 
  },

  linhaDivisoria: {
    height: 1,
    backgroundColor: '#2D2D2D',
    width: '100%',
    marginTop: 12,
  },
  cardForm: { backgroundColor: '#1E1E1E', borderRadius: 10, padding: 20, borderWidth: 1, borderColor: '#333', marginBottom: 24 },
  labelSecao: { 
    color: '#D4AF37', 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginTop: 16, marginBottom: 8, 
    textTransform: 'uppercase'
   },
   
  input: { backgroundColor: '#121212', color: '#FFFFFF', borderWidth: 1, borderColor: '#444', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  
  grupoOpcoes: {
    width: '100%',
    textAlign:'center',
    gap: 10 
  },

  blocoDiaContainer: {
    marginBottom: 8,
  },
  botaoDiaAcordeon: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  botaoDiaAcordeonSelecionado: {
    backgroundColor: '#252525',
    borderColor: '#D4AF37',
  },
  textoDiaAcordeon: {
    color: '#AAA',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textoDiaAcordeonSelecionado: {
    color: '#D4AF37',
  },
  containerHorariosInterno: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#333',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
    marginTop: -2,
    gap: 8,
  },
  subtituloHorarios: {
    color: '#888',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  
  // Estilos da grade compacta de horários (chips)
  gridHorarios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipHorario: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '22%', // Encaixa cerca de 4 horários por linha
  },
  chipHorarioSelecionado: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  textoChipHorario: {
    color: '#AAA',
    fontSize: 13,
    fontWeight: '600',
  },
  textoChipHorarioSelecionado: {
    color: '#121212',
    fontWeight: 'bold',
  },

  opcaoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6 
  },
  radioCirculo: { height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#777', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioCirculoSelecionado: { borderColor: '#D4AF37' },
  radioPonto: { height: 10, width: 10, borderRadius: 5, backgroundColor: '#D4AF37' },
  opcaoTexto: { color: '#AAA', fontSize: 15 },
  opcaoTextoSelecionado: { color: '#FFF', fontWeight: 'bold' },
  btnConfirmar: { backgroundColor: '#D4AF37', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  btnTextConfirmar: { color: '#121212', fontWeight: 'bold', fontSize: 15, letterSpacing: 1 },
  btnVoltar: { backgroundColor: '#2A2A2A', padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#444', marginBottom: 20 },
  btnTextVoltar: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});