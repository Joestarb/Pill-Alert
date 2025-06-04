import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Layout, Text, List } from '@ui-kitten/components';

const data = [
    { time: '08:10', patient: 'Juan', medication: 'Paracetamol', status: 'done' },
    { time: '09:20', patient: 'Luis Gómez', medication: 'Amoxicilina', status: 'done' },
    { time: '11:20', patient: 'Luis Gómez', medication: 'Aspirina', status: 'done' },
    { time: '13:20', patient: 'Luis Gómez', medication: 'Amoxicilina', status: 'done' },
    { time: '15:20', patient: 'María López', medication: 'Ibuprofeno', status: 'done' },
    { time: '18:20', patient: 'Roberto Silva', medication: 'Omeprazol', status: 'done' },
    { time: '20:00', patient: 'Luis Gómez', medication: 'Amoxicilina', status: 'pending' },
    { time: '21:00', patient: 'Jose Dominguez', medication: 'Amoxicilina', status: 'pending' },
];

export default function ListaHoriario() {
    const barHeight = 40 + data.length * 65; // Ajustar tamaño dinámico según el número de pacientes

    const renderItem = ({ item }) => {
        let imageSource = item.status === 'done' 
            ? require('../../assets/images/veriIcon.png') 
            : require('../../assets/images/clockIcon.png');

        return (
            <View style={styles.card}>
                <View style={styles.itemContent}>
                    <Text style={styles.time}>{item.time}</Text>
                    <View style={styles.medBox}>
                        <Text category="s1">{item.patient}</Text>
                        <Text category="c1">{item.medication}</Text>
                    </View>
                    <Image source={imageSource} style={styles.imageIcon}/>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Text style={styles.title}>Lista de Horarios</Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={[styles.sideBarContainer, { height: barHeight }]}>
                    <View style={styles.dot} /> 
                    <View style={styles.sideBar} />
                    <View style={styles.dot} /> 
                </View>

                <Layout style={[styles.container, {padding: 16}]}>
                    <List 
                        data={data} 
                        renderItem={renderItem} 
                        contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1 }} 
                    />
                </Layout>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 16,
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
    },
    sideBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 20,
    },
    sideBar: {
        width: 10,
        flexGrow: 1,
        backgroundColor: '#2e2e5c',
        borderRadius: 10,
    },
    dot: {
        width: 16,
        height: 16,
        backgroundColor: '#2e2e5c',
        borderRadius: 8,
        marginVertical: -5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2, 
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        gap: 12,
    },
    time: {
        fontWeight: 'bold',
    },
    medBox: {
        flex: 1,
    },
    imageIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});
