// CODIGO DA TELA (CODIGO BARBEARIA) LOGIN ADM
import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/config-API';

export default function AdminLoginScreen() {
  const router = useRouter();
  const [codigoAdm, setCodigoAdm] = useState('');
  const [carregando, setCarregando] = useState(false);

  const autenticarAdmin = async () => {
    if (!codigoAdm.trim()) {
      Alert.alert('Atenção', 'Digite o Código de Acesso!');
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fetch(`${API_URL}/admin/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: codigoAdm.trim() }),
      });

      const dados = await resposta.json();

      if (resposta.ok && dados.autorizado) {
        setCodigoAdm('');
        router.push('/admin/painel');
      } else {
        Alert.alert('Erro', dados.erro || 'Código incorreto!');
      }
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível ligar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.titulo}>Acesso Administrativo</Text>
        <Text style={styles.label}>Digite o Código de Acesso</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o Código"
          placeholderTextColor="#777"
          secureTextEntry
          keyboardType="numeric"
          value={codigoAdm}
          onChangeText={setCodigoAdm}
        />

        <TouchableOpacity 
          style={styles.botao} 
          onPress={autenticarAdmin}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>
            {carregando ? 'VERIFICANDO...' : 'ENTRAR'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkVoltar} 
          onPress={() => router.back()}
        >
          <Text style={styles.textoVoltar}>VOLTAR</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 5,
    textAlign: 'center',
    width:'100%'// Garante que ocupa a largura total do card
  },
  input: {
    width: '100%',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  botao: {
    width: '100%',
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotao: {
    color: '#121212',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkVoltar: {
    paddingVertical: 8,
  },
  textoVoltar: {
    color: '#888888',
    fontSize: 14,
    fontWeight: 'bold',
  },
});