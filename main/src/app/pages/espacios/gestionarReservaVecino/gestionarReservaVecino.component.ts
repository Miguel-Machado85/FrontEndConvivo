import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnularPopupComponent } from './anular-popup.component';
import { ModificarPopupComponent } from './modificar-popup.component';
// If this component is used in a parent module, ensure GestionarReservaVecinoModule is imported there.

@Component({
  selector: 'app-gestionar-reserva-vecino',
  templateUrl: './gestionarReservaVecino.component.html',
  styleUrls: ['./style.scss'],
  standalone: true,
  imports: [CommonModule, AnularPopupComponent, ModificarPopupComponent]
})
export class GestionarReservaVecinoComponent {
  showAnularPopup = false;
  showModificarPopup = false;
  selectedReserva: { espacio: string; fecha: string; hora: string } | null = null;

  openAnularPopup(reserva: { espacio: string; fecha: string; hora: string }) {
    this.selectedReserva = reserva;
    this.showAnularPopup = true;
  }

  openModificarPopup(reserva: { espacio: string; fecha: string; hora: string }) {
    this.selectedReserva = reserva;
    this.showModificarPopup = true;
  }

  closeAnularPopup() {
    this.showAnularPopup = false;
    this.selectedReserva = null;
  }

  closeModificarPopup() {
    this.showModificarPopup = false;
    this.selectedReserva = null;
  }

  confirmAnularReserva() {
    // TODO: Implement actual anular logic
    console.log('Anular reserva:', this.selectedReserva);
    this.closeAnularPopup();
  }

  confirmModificarReserva(updatedReserva: { espacio: string; fecha: string; hora: string }) {
    // TODO: Implement actual modificar logic
    console.log('Modificar reserva:', updatedReserva);
    this.closeModificarPopup();
  }
}
