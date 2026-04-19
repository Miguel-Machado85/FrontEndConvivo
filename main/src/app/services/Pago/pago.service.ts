import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentWithStats, MiPago } from 'src/app/models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private api_url = 'http://localhost:3000/pago';

  constructor(private http: HttpClient) {}

  /**
   * Create a new payment for all Vecinos in a Conjunto
   */
  createPayment(payload: any): Observable<Payment> {
    const endpoint = `${this.api_url}/crear`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.post<Payment>(endpoint, payload, { headers });
  }

  /**
   * List all payments for a Conjunto with aggregated stats
   */
  listPayments(conjuntoId: string): Observable<PaymentWithStats[]> {
    const endpoint = `${this.api_url}/listar/${conjuntoId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<PaymentWithStats[]>(endpoint, { headers });
  }

  /**
   * Get a single payment with detailed Vecino information
   */
  getPaymentDetail(pagoId: string): Observable<PaymentWithStats> {
    const endpoint = `${this.api_url}/${pagoId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<PaymentWithStats>(endpoint, { headers });
  }

  /**
   * Get current Vecino's payments (their own only)
   */
  getMisPayments(): Observable<MiPago[]> {
    const endpoint = `${this.api_url}/vecino/mio`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<MiPago[]>(endpoint, { headers });
  }

  /**
   * Process a simulated payment for a Vecino
   * (Will be replaced with real Stripe payment in Stage 4)
   */
  pagarSimulado(pagoId: string, montoReal?: number): Observable<Payment> {
    const endpoint = `${this.api_url}/${pagoId}/pagar-simulado`;
    const body = montoReal ? { montoReal } : {};
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.patch<Payment>(endpoint, body, { headers });
  }
}
