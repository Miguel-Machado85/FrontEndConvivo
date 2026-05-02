import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { PagoService } from 'src/app/services/Pago/pago.service';
import { MiPago, EstadoPago } from 'src/app/models/pago.model';

/**
 * Payment History Component
 * Displays completed (paid) payments history
 */
@Component({
  selector: 'app-pagos-historial',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="historial-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">Historial de Pagos</h1>
            <p class="page-subtitle">Revisa el registro de tus pagos completados</p>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats">
        <div class="stat-item">
          <p class="stat-label">Total Pagado</p>
          <p class="stat-value">{{ formatCurrency(totalPagado) }}</p>
        </div>
        <div class="stat-item">
          <p class="stat-label">Pagos Completados</p>
          <p class="stat-value">{{ pagosHistorial.length }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading">
        <p>Cargando historial...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && pagosHistorial.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
        </svg>
        <p>No hay historial de pagos aún</p>
        <p class="empty-subtitle">Tus pagos completados aparecerán aquí</p>
      </div>

      <!-- Payment History Table -->
      <div *ngIf="!isLoading && pagosHistorial.length > 0" class="historial-section">
        <div class="historial-list">
          <div *ngFor="let pago of pagosHistorial" class="historial-row">
            <!-- Row Header -->
            <div class="row-header">
              <div class="left-content">
                <div class="payment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="payment-info">
                  <h4 class="payment-description">{{ pago.descripcion }}</h4>
                  <p class="payment-date">Pagado el {{ formatDate(pago.fechaPago) }}</p>
                </div>
              </div>
              <div class="amount">
                <p class="amount-value">{{ formatCurrency(pago.montoReal || pago.monto) }}</p>
                <p class="amount-label">Pagado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .historial-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 48px;
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .page-header {
      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
      }

      .page-title {
        font-size: 36px;
        font-weight: 600;
        line-height: 44px;
        color: #101828;
        margin: 0;
      }

      .page-subtitle {
        font-size: 18px;
        font-weight: 400;
        line-height: 28px;
        color: #4a5565;
        margin: 8px 0 0 0;
      }
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;

      .stat-item {
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e5e7eb;

        .stat-label {
          font-size: 14px;
          font-weight: 500;
          color: #6a7282;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #101828;
          margin: 0;
        }
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      background: white;
      border-radius: 12px;
      color: #6a7282;
      font-size: 16px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      background: white;
      border-radius: 12px;
      padding: 48px 24px;
      text-align: center;

      svg {
        margin-bottom: 16px;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #101828;

        &.empty-subtitle {
          font-size: 14px;
          color: #6a7282;
          margin-top: 8px;
        }
      }
    }

    .historial-section {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;

      .historial-list {
        display: flex;
        flex-direction: column;
      }

      .historial-row {
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
        transition: all 0.2s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #f9fafb;
        }

        .row-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;

          .left-content {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;

            .payment-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 48px;
              background-color: #d1fae5;
              border-radius: 50%;
              flex-shrink: 0;

              svg {
                color: #10b981;
              }
            }

            .payment-info {
              display: flex;
              flex-direction: column;
              gap: 4px;

              .payment-description {
                font-size: 16px;
                font-weight: 600;
                color: #101828;
                margin: 0;
              }

              .payment-date {
                font-size: 14px;
                color: #6a7282;
                margin: 0;
              }
            }
          }

          .amount {
            text-align: right;

            .amount-value {
              font-size: 18px;
              font-weight: 600;
              color: #10b981;
              margin: 0;
            }

            .amount-label {
              font-size: 12px;
              color: #6a7282;
              margin: 4px 0 0 0;
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .historial-container {
        padding: 24px;
      }

      .summary-stats {
        grid-template-columns: 1fr;
      }

      .historial-row {
        padding: 16px;

        .row-header {
          flex-direction: column;
          align-items: flex-start;

          .amount {
            width: 100%;
            text-align: left;
          }
        }
      }
    }
  `]
})
export class PagosHistorialComponent implements OnInit {
  pagosHistorial: MiPago[] = [];
  totalPagado = 0;
  isLoading = false;

  constructor(private pagoService: PagoService) {}

  ngOnInit(): void {
    this.loadHistorial();
  }

  /**
   * Load payment history (paid payments only)
   */
  loadHistorial(): void {
    this.isLoading = true;
    this.pagoService.getMisPayments().subscribe({
      next: (pagos) => {
        this.pagosHistorial = pagos
          .filter(p => p.estado === EstadoPago.Paid)
          .sort((a, b) => {
            if (!a.fechaPago || !b.fechaPago) return 0;
            return new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime();
          });
        
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading historial:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Calculate total paid amount
   */
  calculateStats(): void {
    this.totalPagado = this.pagosHistorial.reduce((sum, p) => sum + (p.montoReal || p.monto), 0);
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
}
