import { StyleSheet, View, Pressable, Text } from "react-native";

export default function Menu({onChooseOption}) {
    return (
    <View style={styles.mainContainer}>
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => {
                onChooseOption('photo');
            }}>
                <Text style={styles.text}>Classify lights on photo</Text>
            </Pressable>
        </View>
        {/* <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => {
                onChooseOption('realTime');
            }}>
                <Text style={styles.text}>Real time detection && classification</Text>
            </Pressable>
        </View>
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => {
                onChooseOption('about');
            }}>
                <Text style={styles.text}>About the app</Text>
            </Pressable>
        </View> */}
    </View>)
} 

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      display: 'flex',
      backgroundColor: '#ececec',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      height: 250,
      width: '95%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      height: 150,
      width: '90%',
      margin: 20,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#b2fa9c',
      borderRadius: 10,
      borderWidth: 5,
      borderColor: '#661274',
    },
    text: {
      fontSize: 30,
      color: '#1a2517',
      fontWeight: 'bold',
      textAlign: 'center',
    }
  });