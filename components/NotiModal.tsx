import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface NotiModalProps {
    visible: boolean;
    onClose: () => void;
}

const NotiModal: React.FC<NotiModalProps> = ({ visible, onClose }) => {
    return (
        <Modal
        transparent
        visible={visible}
        animationType='fade'
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Hora de tomar su pastilla!</Text>
                    <Image source={require('../assets/images/PillQuestion.png')} style={styles.image}/>
                    <Text style={styles.message}>Favor de esperar a que llegue su encargado</Text>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Aceptar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
    };

    const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 'auto',
        height: 'auto',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 20,
        color: '#3366FF'
    },
    image: {
        width: 250,
        height: 200,
        marginBottom: 15,
        resizeMode: 'contain',
        },
    message: {
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#3366FF",
        borderColor: "transparent",
        shadowColor: "#3366FF",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
    },
});

export default NotiModal;
