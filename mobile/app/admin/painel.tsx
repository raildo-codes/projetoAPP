// CODIGO PAINEL ADMINISTRATIVO
import React, { useState, useEffect } from 'react';
import { View,Text,TouchableOpacity,Alert,ActivityIndicator,StyleSheet } from 'react-native';// StyleSheet: para criar e otimizar estilos(css reAct), Text: mostrar texto na tela, View: contenie, TouchableOpacity: torna elementos clicavél com efeitos, TextImput: caixa para digitar, Alert: mensagens de aviso do sistema
import { useRouter } from 'expo-router';//chama a tela do cliente, trazendo a função de navegação
import { API_URL } from '@/constants/config-API';// importa a pasta contants onde esta o ipv4

interface Agendamento {
  id: number;
  nome: string;
  servico: string;
  barbeiro: string;
  horario: string;
  status: string;
  dia?: string; // ➔ ADICIONADO: Propriedade opcional para armazenar o dia da semana vindo do banco de dados
}

export default function PainelBarbeariaScreen() {
  const router = useRouter();

  const [fila, setFila] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [chamando, setChamando] = useState(false);

  useEffect(() => {
    carregarFila();
  }, []);

  const carregarFila = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch(`${API_URL}/fila`);
      const dados = await resposta.json();

      if (resposta.ok) {
        setFila(dados);
      } else {
        Alert.alert('Erro', dados.erro || 'Falha ao carregar a fila.');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const handleChamarProximo = async () => {
    if (fila.length === 0) {
      Alert.alert('Aviso', 'Não há clientes aguardando na fila.');
      return;
    }

    const proximo = fila[0];

    try {
      setChamando(true);
      const resposta = await fetch(`${API_URL}/agendamentos/${proximo.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'atendido' }),
      });

      if (resposta.ok) {
        Alert.alert('Chamado!', `O cliente ${proximo.nome.toUpperCase()} foi chamado!`);
        carregarFila();
      } else {
        const erro = await resposta.json();
        Alert.alert('Erro', erro.erro || 'Falha ao atualizar o cliente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o atendimento.');
    } finally {
      setChamando(false);
    }
  };

  const proximoCliente = fila.length > 0 ? fila[0] : null;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>PAINEL ADMINISTRATIVO</Text>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (

        <View style={styles.content}>
          {/* Card Aviso ADM */}
          <View style={styles.cardAvisoAdm}>
            <Text style={styles.totalFilaTexto}>
              {fila.length} {fila.length === 1 ? 'CLIENTE NA FILA' : 'CLIENTES NA FILA'}
            </Text>
          </View>

          {/* Card Próximo Cliente */}
          <View style={styles.cardProximo}>
            <Text style={styles.secaoTitulo}>PRÓXIMO CLIENTE:</Text>
            {proximoCliente ? (

              <View style={styles.detalhesCliente}>

                <Text style={styles.infoTexto}>
                  • <Text style={styles.infoBold}>Nome: </Text> {proximoCliente.nome.toUpperCase()}
                </Text>

                {/* ➔ ADICIONADO NO JSX: Linha que exibe o Dia da Semana no painel do administrador */}
                <Text style={styles.infoTexto}>
                  • <Text style={styles.infoBold}>Dia: </Text> {proximoCliente.dia ? proximoCliente.dia.toUpperCase() : 'NÃO INFORMADO'}
                </Text>

                <Text style={styles.infoTexto}>
                  • <Text style={styles.infoBold}>Horário: </Text> {proximoCliente.horario}
                </Text>

                <Text style={styles.infoTexto}>
                  • <Text style={styles.infoBold}>Barbeiro: </Text> {proximoCliente.barbeiro.toUpperCase()}
                </Text>

                <Text style={styles.infoTexto}> 
                 • <Text style={styles.infoBold}>Serviço: </Text> {proximoCliente.servico || 'Corte Cabelo'}  
                 </Text> 

              </View>
            ) : (
              <Text style={styles.textoFilaVazia}>Nenhum cliente aguardando no momento.</Text>
            )}

            <TouchableOpacity
              style={[styles.btnChamar, (!proximoCliente || chamando) && styles.btnDesativado]}
              onPress={handleChamarProximo}
              disabled={!proximoCliente || chamando}
            >
              <Text style={styles.btnChamarTexto}>
                {chamando ? 'CHAMANDO...' : 'CHAMAR PRÓXIMO CLIENTE'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botões do Menu */}
          <View style={styles.menuContainer}>

            <TouchableOpacity style={styles.btnNavegacao}
             onPress={() => router.push('/admin/servicosADM')}>
            <Text style={styles.btnNavegacaoTexto}>SERVIÇOS ADM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnNavegacao}
             onPress={()=> router.push('/admin/barbeiro')}>
            <Text style={styles.btnNavegacaoTexto}>BARBEIROS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSair}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.btnSairTexto}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  cardAvisoAdm: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
  },
  totalFilaTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardProximo: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: '#333333',
    marginVertical: 10,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
    letterSpacing: 1,
  },
  detalhesCliente: {
    gap: 6,
    marginBottom: 16,
  },
  infoTexto: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  infoBold: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textoFilaVazia: {
    color: '#777777',
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 12,
    textAlign: 'center',
  },
  btnChamar: {
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnDesativado: {
    backgroundColor: '#444444',
  },
  btnChamarTexto: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.8,
  },
  menuContainer: {
    gap: 10,
  },
  btnNavegacao: {
    backgroundColor: '#242424',
    paddingVertical: 13,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  btnNavegacaoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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