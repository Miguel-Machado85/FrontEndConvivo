import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { PagoService } from 'src/app/services/Pago/pago.service';
import { PaymentWithStats, PaymentDetailWithUser, EstadoPago } from 'src/app/models/pago.model';

@Component({
  selector: 'app-detalle-pago',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MaterialModule],
  templateUrl: './detallePago.component.html',
  styleUrls: ['./detallePago.component.scss']
})
export class DetallePagoComponent implements OnInit {
  pagoId: string = '';
  pago: PaymentWithStats | null = null;
  isLoading = false;

  // Filtering
  searchText = '';
  filtroSeleccionado: 'todos' | 'pagados' | 'pendientes' = 'todos';
  detallesFiltrados: PaymentDetailWithUser[] = [];

  EstadoPago = EstadoPago;

  constructor(
    private pagoService: PagoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pagoId = params.get('pagoId') || '';
      if (this.pagoId) {
        this.loadPagoDetail();
      }
    });
  }

  /**
   * Load payment details by ID
   */
  loadPagoDetail(): void {
    this.isLoading = true;
    this.pagoService.getPaymentDetail(this.pagoId).subscribe({
      next: (response) => {
        // Flatten stats from nested object to top-level properties
        if (response.stats) {
          this.pago = {
            ...response,
            totalCount: response.stats.totalCount,
            pagadosCount: response.stats.pagadosCount,
            pendientesCount: response.stats.pendientesCount,
            vencidosCount: response.stats.vencidosCount,
            porcentajePagados: response.stats.porcentajePagados,
          };
        } else {
          this.pago = response;
        }
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pago detail:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigate back to the list view
   */
  volverLista(): void {
    this.router.navigate(['/pagos/list']);
  }

  /**
   * Get count of residents by status
   */
  getPagadosCount(): number {
    if (!this.pago?.detalles) return 0;
    return this.pago.detalles.filter((d) => d.estado === EstadoPago.Paid).length;
  }

  /**
   * Get total amount collected (pagadosCount * monto)
   */
  getMontoRecaudado(): number {
    if (!this.pago?.monto) return 0;
    return this.getPagadosCount() * this.pago.monto;
  }

  /**
   * Get pending amount (pendientes * monto)
   */
  getMontoPendiente(): number {
    if (!this.pago?.monto || !this.pago?.totalCount) return 0;
    return (this.pago.totalCount - this.getPagadosCount()) * this.pago.monto;
  }

  /**
   * Apply search and status filters to the residents list
   */
  applyFilters(): void {
    if (!this.pago?.detalles) {
      this.detallesFiltrados = [];
      return;
    }

    let filtered = this.pago.detalles as PaymentDetailWithUser[];

    // Filter by status
    if (this.filtroSeleccionado === 'pagados') {
      filtered = filtered.filter((d) => d.estado === EstadoPago.Paid);
    } else if (this.filtroSeleccionado === 'pendientes') {
      filtered = filtered.filter((d) => d.estado !== EstadoPago.Paid);
    }

    // Filter by search text
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter((d) => {
        const nombre = (d.usuarioId?.nombreCompleto || '').toLowerCase();
        const apartamento = (d.usuarioId?.numeroApartamento || '').toString();
        return nombre.includes(search) || apartamento.includes(search);
      });
    }

    this.detallesFiltrados = filtered;
  }

  /**
   * Change status filter and re-apply filters
   */
  setFiltro(filtro: 'todos' | 'pagados' | 'pendientes'): void {
    this.filtroSeleccionado = filtro;
    this.applyFilters();
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
  formatDate(date: Date | string | undefined): string {
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
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  }

  /**
   * Get status badge text and color
   */
  getStatusBadge(detalle: PaymentDetailWithUser): { text: string; color: string } {
    if (detalle.estado === EstadoPago.Paid) {
      return { text: 'Pagado', color: 'success' };
    } else if (detalle.estado === EstadoPago.Overdue) {
      return { text: 'Vencido', color: 'danger' };
    }
    return { text: 'Pendiente', color: 'warning' };
  }

  /**
   * Get CSS class for status badge
   */
  getStatusClass(estado: string): { [key: string]: boolean } {
    return {
      '__paid': estado === EstadoPago.Paid,
      '__pending': estado === EstadoPago.Pending,
      '__overdue': estado === EstadoPago.Overdue
    };
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (!this.pago?.totalCount || this.pago.totalCount === 0) return 0;
    return Math.round((this.getPagadosCount() / this.pago.totalCount) * 100);
  }

  get f() {
    return {
      searchText: this.searchText
    };
  }
}
