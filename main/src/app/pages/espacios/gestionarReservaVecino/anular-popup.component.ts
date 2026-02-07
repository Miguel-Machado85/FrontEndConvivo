import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reserva } from 'src/app/models/reserva.model';

@Component({
    selector: 'app-anular-popup',
    templateUrl: './anular-popup.component.html',
    styleUrls: ['./anular-popup.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AnularPopupComponent {
    @Input() reserva: Reserva | null = null;
    @Output() closePopup = new EventEmitter<void>();
    @Output() confirmAnular = new EventEmitter<Reserva>();

    close() {
        this.closePopup.emit();
    }

    anularReserva() {
        if(this.reserva){
            this.confirmAnular.emit(this.reserva);
        }
    }
}
