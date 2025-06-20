import { supabase } from "@/utils/supabase";

export interface medicationItem {
    id: number;
    time: string;
    patient: string;
    medication: string;
    status: 'pending' | 'done';
}

export interface MedicationResult {
    groupName: string;
    items: medicationItem[];
}

export const fetchMedication = async (nurseEmail: string): Promise<MedicationResult> => {
    // Buscar el usuario loggeado
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_id, fk_group_id')
        .eq('user_email', nurseEmail)
        .single();

    if (userError || !user) {
        console.error('Error buscando al usuario loggeado', userError);
        return { groupName: '', items: [] };
    }

    const groupID = user.fk_group_id;

    // Obtener el nombre del grupo
    const { data: groupData, error: groupError } = await supabase
        .from('user_groups')
        .select('group_name')
        .eq('group_id', groupID)
        .single();

    const groupName = groupData?.group_name || 'Sin grupo';

    if (groupError) {
        console.error('Error obteniendo el nombre del grupo:', groupError);
    }

    //Obtener pacientes del grupo
    const { data: patients, error: patientError } = await supabase
        .from('users')
        .select('user_id')
        .eq('fk_group_id', groupID)
        .eq('fk_role_id', 2);

    if (patientError || !patients) {
        console.error('Error buscando los pacientes: ', patientError);
        return { groupName, items: [] };
    }

    const patientIDs = patients.map(p => p.user_id);
    if (patientIDs.length === 0) return { groupName, items: [] };

    console.log('Patient IDs found:', patientIDs);

    // Obtener registros de medicamentos 
    const { data, error } = await supabase
        .from('medication_consumed')
        .select(`
            medication_consumed_id,
            fk_schedule_id,
            fk_medication_id,
            fk_user_id,
            users!fk_user_id(user_name),
            medications!fk_medication_id(medications),
            schedules!fk_schedule_id(schedule)
        `)
        .in('fk_user_id', patientIDs);

    if (error || !data) {
        console.error('Error obteniendo medicamentos: ', error);
        return { groupName, items: [] };
    }

    console.log('Raw medication data:', JSON.stringify(data[0], null, 2));

    const items: medicationItem[] = data.map((item: any): medicationItem => ({
        id: item.medication_consumed_id,
        time: item.schedules?.schedule ?? 'Sin horario',
        patient: item.users?.user_name ?? 'Desconocido',
        medication: item.medications?.medications ?? 'Desconocido',
        status: 'pending',
    }));

    return { groupName, items };
};