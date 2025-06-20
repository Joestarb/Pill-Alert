import React, {useState, useEffect} from 'react';
import { View, StyleSheet, SafeAreaView, Image, ListRenderItemInfo } from 'react-native';
import { Layout, Text, List } from '@ui-kitten/components';
import { supabase } from '@/utils/supabase';
import { fetchMedication, medicationItem, MedicationResult } from '@/api/supabaseMedication';

export default function ListaHoriario() {
    const [medications, setMedications] = useState<medicationItem[]>([]);
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Obtener el email del usuario loggeado
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user?.email) {
                    console.error('No se encontró usuario loggeado');
                    setMedications([]);
                    setGroupName('Usuario no encontrado');
                    return;
                }

                console.log('Usuario loggeado:', user.email);

                // Obtener medicamentos filtrados por grupo
                const result: MedicationResult = await fetchMedication(user.email);
                
                console.log('Resultado obtenido:', result);
                
                setMedications(result.items);
                setGroupName(result.groupName);
                
            } catch (error) {
                console.error('Error cargando datos:', error);
                setMedications([]);
                setGroupName('Error al cargar');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const dataToRender = medications.length > 0
        ? medications
        : [{
            id: 0,
            time: '00:00',
            patient: 'Sin pacientes',
            medication: 'Sin medicamentos',
            status: 'pending' as 'pending'
        }];

    const dispGroup = groupName.trim().length > 0 ? groupName : "Sin grupo";
    
    const barHeight = 60 + medications.length * 65;
    
    const renderItem = ({ item }: ListRenderItemInfo<medicationItem>) => {
        const imageSource = item.status === 'done' 
            ? require('../../assets/images/veriIcon.png') 
            : require('../../assets/images/clockIcon.png');

        return (
            <View style={styles.card}>
                <View style={styles.itemContent}>
                    <Text style={styles.time}>{item.time || 'Sin horario'}</Text>
                    <View style={styles.medBox}>
                        <Text category="s1">{item.patient}</Text>
                        <Text category="c1">{item.medication}</Text>
                    </View>
                    <Image source={imageSource} style={styles.imageIcon}/>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.loadtext}>Cargando medicamentos...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Text style={styles.title}>Lista de Horarios</Text>
            </View>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.subtitle}>Grupo: {dispGroup}</Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={[styles.sideBarContainer, { height: barHeight }]}>
                    <View style={styles.dot} /> 
                    <View style={styles.sideBar} />
                    <View style={styles.dot} /> 
                </View>

                <Layout style={[styles.container, {padding: 16}]}>
                    <List 
                        data={dataToRender} 
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
    subtitle: {
        alignItems: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
    },
    loadtext: {
        alignItems: 'center',
        fontSize: 20,
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
