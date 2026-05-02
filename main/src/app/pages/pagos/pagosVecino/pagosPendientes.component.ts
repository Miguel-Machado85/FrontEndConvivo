import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PagoService } from 'src/app/services/Pago/pago.service';
import { MiPago, EstadoPago } from 'src/app/models/pago.model';

/**
 * Payment Confirmation Dialog Component
 */
@Component({
  selector: 'app-payment-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatDialogModule],
  template: `
    <div class="confirmation-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <h2 class="dialog-title">Confirmar Pago</h2>
        <p class="dialog-subtitle">Revisa los detalles del pago antes de confirmar</p>
        <button mat-icon-button (click)="onCancel()" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <!-- Payment Details -->
      <div class="payment-details">
        <div class="detail-section">
          <div class="detail-row">
            <span class="detail-label">Concepto:</span>
            <span class="detail-value">{{ pago.descripcion }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Monto a pagar:</span>
            <span class="detail-value amount">{{ formatCurrency(pago.monto) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Fecha de vencimiento:</span>
            <span class="detail-value">{{ formatDate(pago.fechaDebida) }}</span>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="payment-method">
          <div class="method-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 8H4V6h16m0 10H4v-2h16m0 6H4v-2h16m1-18H3c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </div>
          <div class="method-details">
            <p class="method-name">Tarjeta de Crédito</p>
            <p class="method-number">**** **** **** 4242</p>
          </div>
        </div>

        <!-- Note -->
        <div class="note-section">
          <p><strong>Nota:</strong> Esta es una simulación de pago. En producción, aquí se integraría con una pasarela de pagos real.</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <button class="btn btn-primary" (click)="onConfirm()" [disabled]="isProcessing">
          <span *ngIf="!isProcessing">Confirmar Pago</span>
          <span *ngIf="isProcessing">Procesando...</span>
        </button>
        <button class="btn btn-secondary" (click)="onCancel()" [disabled]="isProcessing">
          Cancelar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background: white;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .close-btn {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        opacity: 0.7;

        &:hover {
          opacity: 1;
        }
      }
    }

    .dialog-title {
      font-size: 22px;
      font-weight: 600;
      line-height: 28px;
      color: #0a0a0a;
      margin: 0;
    }

    .dialog-subtitle {
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      color: #717182;
      margin: 0;
    }

    .payment-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-section {
      background-color: #f9fafb;
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;

      .detail-label {
        font-size: 12px;
        font-weight: 400;
        color: #4a5565;
      }

      .detail-value {
        font-size: 13px;
        font-weight: 400;
        color: #101828;
        text-align: right;

        &.amount {
          font-size: 18px;
          font-weight: 600;
          color: #1268c4;
        }
      }
    }

    .payment-method {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 12px;
      display: flex;
      gap: 10px;
      align-items: center;

      .method-icon {
        width: 44px;
        height: 36px;
        background: linear-gradient(to right, #155dfc, #51a2ff);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        svg {
          color: white;
          width: 20px;
          height: 20px;
        }
      }

      .method-details {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .method-name {
          font-size: 13px;
          font-weight: 500;
          color: #101828;
          margin: 0;
        }

        .method-number {
          font-size: 11px;
          font-weight: 400;
          color: #6a7282;
          margin: 0;
        }
      }
    }

    .note-section {
      background-color: #eff6ff;
      border: 1px solid #bedbff;
      border-radius: 10px;
      padding: 12px;

      p {
        font-size: 11px;
        line-height: 16px;
        color: #193cb8;
        margin: 0;

        strong {
          font-weight: 700;
        }
      }
    }

    .dialog-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;

      .btn {
        flex: 1;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        &.btn-primary {
          background-color: #1268c4;
          color: white;

          &:hover:not(:disabled) {
            background-color: #0d52a0;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        &.btn-secondary {
          background-color: white;
          color: #0a0a0a;
          margin: 0;
        }
      }
    }

    .note-section {
      background-color: #eff6ff;
      border: 1px solid #bedbff;
      border-radius: 15px;
      padding: 24px;

      p {
        font-size: 21px;
        line-height: 30px;
        color: #193cb8;
        margin: 0;

        strong {
          font-weight: 700;
        }
      }
    }

    .dialog-actions {
      display: flex;
      gap: 16px;
      margin-top: 12px;

      .btn {
        flex: 1;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 21px;
        font-weight: 500;
        line-height: 30px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        &.btn-primary {
          background-color: #1268c4;
          color: white;

          &:hover:not(:disabled) {
            background-color: #0d52a0;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }

        &.btn-secondary {
          background-color: white;
          color: #0a0a0a;
          border: 2px solid #1268c4;

          &:hover:not(:disabled) {
            background-color: #eff6ff;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
    }
  `]
})
export class PaymentConfirmationDialogComponent {
  isProcessing = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public pago: MiPago,
    private dialogRef: MatDialogRef<PaymentConfirmationDialogComponent>,
    private pagoService: PagoService
  ) {}

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      const parts = date.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  }

  onConfirm(): void {
    this.isProcessing = true;
    this.pagoService.pagarSimulado(this.pago.pagoId).subscribe({
      next: () => {
        this.isProcessing = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error procesando pago:', err);
        this.isProcessing = false;
        alert('Error al procesar el pago. Por favor, intenta de nuevo.');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

/**
 * Pagos Pendientes Component (Pending Payments View with inline Payment History)
 * Displays both pending/overdue payments and payment history in tabs
 */
@Component({
  selector: 'app-pagos-pendientes',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, MatDialogModule],
  templateUrl: './pagosPendientes.component.html',
  styleUrls: ['./pagosPendientes.component.scss']
})
export class PagosPendientesComponent implements OnInit {
  misPagos: MiPago[] = [];
  pagospendientes: MiPago[] = [];
  pagosHistorial: MiPago[] = [];
  isLoading = false;
  activeTab: 'pendientes' | 'historial' = 'pendientes';

  constructor(
    private pagoService: PagoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMisPagos();
  }

  /**
   * Load all payments for current Vecino
   */
  loadMisPagos(): void {
    this.isLoading = true;
    this.pagoService.getMisPayments().subscribe({
      next: (pagos) => {
        this.misPagos = pagos;
        this.filterPagos();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading mis pagos:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Filter payments into pending/overdue and paid
   */
  filterPagos(): void {
    this.pagospendientes = this.misPagos.filter(p => p.estado !== EstadoPago.Paid);
    this.pagosHistorial = this.misPagos.filter(p => p.estado === EstadoPago.Paid);
    
    // Sort pending by due date (ascending - urgent first)
    this.pagospendientes.sort((a, b) => new Date(a.fechaDebida).getTime() - new Date(b.fechaDebida).getTime());
    
    // Sort history by payment date (descending - most recent first)
    this.pagosHistorial.sort((a, b) => {
      if (!a.fechaPago || !b.fechaPago) return 0;
      return new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime();
    });
  }

  /**
   * Get total pending amount
   */
  get totalPendiente(): number {
    return this.pagospendientes.reduce((sum, p) => sum + p.monto, 0);
  }

  /**
   * Get total paid amount
   */
  get totalPagado(): number {
    return this.pagosHistorial.reduce((sum, p) => sum + (p.montoReal || p.monto), 0);
  }

  /**
   * Format currency for display
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  /**
   * Format date to readable string
   */
  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      const parts = date.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  }

  /**
   * Determine if payment is overdue
   */
  isOverdue(pago: MiPago): boolean {
    if (pago.estado === EstadoPago.Paid) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(pago.fechaDebida);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  /**
   * Get status badge text and color
   */
  getStatusBadge(pago: MiPago): { text: string; color: string } {
    if (pago.estado === EstadoPago.Paid) {
      return { text: 'Pagado', color: 'success' };
    }
    if (this.isOverdue(pago)) {
      return { text: 'Vencido', color: 'danger' };
    }
    return { text: 'Pendiente', color: 'warning' };
  }

  /**
   * Open payment confirmation dialog
   */
  openPaymentDialog(pago: MiPago): void {
    const dialogRef = this.dialog.open(PaymentConfirmationDialogComponent, {
      width: '450px',
      data: pago,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMisPagos();
      }
    });
  }

  /**
   * Switch tabs
   */
  switchTab(tab: 'pendientes' | 'historial'): void {
    this.activeTab = tab;
  }

  /**
   * Format currency without currency symbol (for Figma design)
   */
  formatCurrencySimple(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Get count of overdue payments
   */
  getOverdueCount(): number {
    return this.pagospendientes.filter(p => this.isOverdue(p)).length;
  }
}
