import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnularPopupComponent } from './anular-popup.component';
import { ModificarPopupComponent } from './modificar-popup.component';
import { Reserva } from 'src/app/models/reserva.model';
import { Router } from '@angular/router';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';

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
    reservas: Reserva[];
    selectedReserva: Reserva | null = null;

    constructor(private reservaService: ReservaService, private router: Router){}

    ngOnInit(): void {
        this.getReservasFuturas();
    }

    getReservasFuturas(){
        const id = localStorage.getItem('id') || '';
        this.reservaService.getReservasByUsuarioId(id).subscribe({
            next: (res)=>{
                this.reservas = res;
                console.log(res);
            },
            error: (err)=>{
                console.log(err)
            }
        })
    }

    openAnularPopup(reserva: Reserva) {
        this.selectedReserva = reserva;
        this.showAnularPopup = true;
    }

    openModificarPopup(reserva: Reserva) {
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

    confirmAnularReserva(id: string) {
        this.reservaService.deleteReserva(id).subscribe({
            next: (res)=>{
                alert("Reserva eliminada")
                console.log('Anular reserva:', this.selectedReserva);
                this.closeAnularPopup();
                this.getReservasFuturas();
            },
            error: (err)=>{
                console.log(err)
            }
        })
    }

    confirmModificarReserva(updatedReserva: Partial<Reserva>) {
        const payload = {
            fecha: updatedReserva.fecha,
            horaInicio: updatedReserva.horaInicio,
            horaFin: updatedReserva.horaFin,
            cantidadPersonas: updatedReserva.cantidadPersonas        
        }
        this.reservaService.updateReserva(updatedReserva.id!, payload).subscribe({
            next: (res)=>{
                alert("Reserva modificada correctamente")
                console.log('Modificar reserva:', updatedReserva);
                this.closeModificarPopup();
                this.getReservasFuturas();
            },
            error: (err)=>{
                console.log({error: err.message})
            }
        })
    }
}
