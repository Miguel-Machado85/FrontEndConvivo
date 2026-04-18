import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { PagoService } from 'src/app/services/Pago/pago.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { PaymentWithStats } from 'src/app/models/pago.model';

@Component({
  selector: 'app-pagos-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, MaterialModule],
  templateUrl: './pagosAdmin.component.html',
  styleUrls: ['./pagosAdmin.component.scss']
})
export class PagosAdminComponent implements OnInit {
  pagos: PaymentWithStats[] = [];
  conjuntoId: string = '';
  isLoading = false;

  // Stats
  totalRecaudado = 0;
  pagosPendientes = 0;
  totalCargos = 0;

  constructor(
    private pagoService: PagoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getConjuntoId();
  }

  /**
   * Get the current user's Conjunto ID and load payments
   */
  getConjuntoId(): void {
    const userId = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(userId).subscribe({
      next: (res) => {
        // Handle conjuntoId as either string or object (populated reference)
        if (typeof res.conjuntoId === 'object' && res.conjuntoId?._id) {
          this.conjuntoId = res.conjuntoId._id;
        } else {
          this.conjuntoId = res.conjuntoId;
        }
        this.loadPagos();
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  /**
   * Load all payments for the Conjunto
   */
  loadPagos(): void {
    if (!this.conjuntoId) return;

    this.isLoading = true;
    this.pagoService.listPayments(this.conjuntoId).subscribe({
      next: (response) => {
        this.pagos = response;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pagos:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Calculate aggregate stats from all payments
   */
  calculateStats(): void {
    this.totalCargos = this.pagos.length;

    let totalPendientes = 0;
    let totalRecaudadoTemp = 0;

    this.pagos.forEach((pago) => {
      const pendientes = pago.detalles?.filter((d) => d.estado !== 'Paid').length || 0;
      totalPendientes += pendientes;
      
      const pagados = pago.detalles?.filter((d) => d.estado === 'Paid').length || 0;
      totalRecaudadoTemp += pagados * pago.monto;
    });

    this.pagosPendientes = totalPendientes;
    this.totalRecaudado = totalRecaudadoTemp;
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
   * Format date to readable string (handles timezone properly)
   */
  formatDate(date: Date | string): string {
    if (!date) return '-';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      // If it's a date string like "2024-04-18", parse it in local timezone
      const parts = date.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        // It's a YYYY-MM-DD string, create date in local timezone
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
   * Get status badge text and color
   */
  getStatusBadge(pago: PaymentWithStats): { text: string; color: string } {
    const today = new Date();
    const today_normalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const dueDate = new Date(pago.fechaDebida);
    const dueDate_normalized = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    if (dueDate_normalized < today_normalized) {
      return { text: 'Vencido', color: 'danger' };
    } else {
      return { text: 'Vigente', color: 'success' };
    }
  }

  /**
   * Navigate to payment detail view
   */
  verDetalle(pagoId: string): void {
    this.router.navigate(['/pagos/detalle', pagoId]);
  }

  /**
   * Navigate to create payment form
   */
  crearCargo(): void {
    this.router.navigate(['/pagos/crear']);
  }
}
