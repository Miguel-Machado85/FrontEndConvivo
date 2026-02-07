import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-anular-popup',
    templateUrl: './anular-popup.component.html',
    styleUrls: ['./anular-popup.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class AnularPopupComponent {
    @Input() reserva: { espacio: string; fecha: string; hora: string } | null = null;
    @Output() closePopup = new EventEmitter<void>();
    @Output() confirmAnular = new EventEmitter<void>();

    close() {
        this.closePopup.emit();
    }

    anularReserva() {
        this.confirmAnular.emit();
    }
}
