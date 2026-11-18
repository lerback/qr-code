import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {PRODUTOS} from './interfaces/ListaProdutos'
import { Produto } from './interfaces/dados/Produtos';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [leitura, setLeitura] = useState(true);
  const [codigoBarra, setCodigoBarra] = useState('');

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function abrirCamera() {
    setLeitura(false)
    setCodigoBarra('')
  }

  function onScanner(resultado: BarcodeScanningResult) {

    if (leitura) {
      return
    }

    if (resultado.data) {
      setLeitura(true)
      
      const produtoEncontrado = PRODUTOS.find(
        function(produto: Produto){
          if (produto.codigo == resultado.data){
              return true
          } 
          return false
        }
      )

      if (produtoEncontrado){
        setCodigoBarra('Produto encontrado!' + "\n" + produtoEncontrado.nome + "\nR$ " + produtoEncontrado.preco)

      } else{
        setCodigoBarra ('Produto NÃO encontrado! :( ' + "\n" + 'Tente novamente!' + "\n" + resultado.data)
        

      }
    
    }
  }


  if (leitura) {
    return (
      <View style={styles.container}>
        <Text style ={styles.title}> Verifique seu código de barra! ;) </Text>
        
       <View>
         <Text> {codigoBarra} </Text>
        <TouchableOpacity style={styles.button}
         onPress={abrirCamera}>
          <Text>abrir camera uou</Text>
          </TouchableOpacity>
       </View>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      
      <CameraView style={styles.camera} onBarcodeScanned={onScanner} />
      <View style={styles.buttonContainer}>
        
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CBC3E3',
    padding: 20,
  },

  title: {
    fontSize: 18,
    marginBottom: 20,
  },

  message: {
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 20,
    fontFamily: 'sans-serif',
     padding: 14,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: '#000',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
   width: '60%',
    height: 50,
    backgroundColor: '#754aa7bb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  
});