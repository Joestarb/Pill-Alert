import React from "react";
import ModalAsignarMedicamento from "../../components/ModalAsignarMedicamento";

interface ModalAsignarProps {
  intervaloHoras: number;
  setIntervaloHoras: (v: number) => void;
  cantidadDias: number;
  setCantidadDias: (v: number) => void;
  visible: boolean;
  usuarioSeleccionado: any;
  fechaHora: Date;
  mostrarDatePicker: boolean;
  mostrarTimePicker: boolean;
  medicamentosDisponibles: any[];
  onRequestClose: () => void;
  onFechaChange: (event: any, selectedDate?: Date) => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
  mostrarDatePickerFecha: () => void;
  mostrarDatePickerHora: () => void;
  cerrarDatePickers: () => void;
  formatearFecha: (fecha: Date) => string;
  formatearHora: (fecha: Date) => string;
  asignarMedicamento: (medicamentoNombre: string) => Promise<void>;
  miligramos: string;
  setMiligramos: (value: string) => void;
  via: string;
  setVia: (value: string) => void;
}

const ModalAsignar: React.FC<ModalAsignarProps> = (props) => {
  return <ModalAsignarMedicamento {...props} />;
};

export default ModalAsignar;
