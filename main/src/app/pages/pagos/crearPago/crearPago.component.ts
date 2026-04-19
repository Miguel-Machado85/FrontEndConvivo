import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { PagoService } from 'src/app/services/Pago/pago.service';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';

export function fechaminValid(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaValue = control.value;
    if (!fechaValue) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(fechaValue);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { fechaMinima: true };
  };
}

@Component({
  selector: 'app-crear-pago',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './crearPago.component.html',
  styleUrls: ['./crearPago.component.scss']
})
export class CrearPagoComponent implements OnInit {
  conjuntoId: string = '';
  isSubmitting = false;

  pagoForm = new FormGroup({
    descripcion: new FormControl('', [Validators.required, Validators.minLength(3)]),
    monto: new FormControl('', [Validators.required, Validators.min(1)]),
    fechaDebida: new FormControl('', [Validators.required, fechaminValid()])
  });

  constructor(
    private pagoService: PagoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getConjuntoId();
  }

  /**
   * Get the current user's Conjunto ID
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
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  /**
   * Submit the form to create a new payment
   */
  createPago(): void {
    if (this.pagoForm.invalid || !this.conjuntoId) {
      return;
    }

    this.isSubmitting = true;

    // Ensure date is sent in local timezone by adding timezone offset
    const fechaDebida = this.pagoForm.get('fechaDebida')?.value;
    let fechaAjustada = fechaDebida;
    if (fechaDebida) {
      const date = new Date(fechaDebida);
      // Adjust for timezone offset (add offset to preserve the local date)
      date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      fechaAjustada = date.toISOString().split('T')[0];
    }

    const payload = {
      descripcion: this.pagoForm.get('descripcion')?.value,
      monto: Number(this.pagoForm.get('monto')?.value),
      fechaDebida: fechaAjustada,
      conjuntoId: this.conjuntoId
    };

    this.pagoService.createPayment(payload).subscribe({
      next: (response) => {
        console.log('Pago creado exitosamente:', response);
        this.router.navigate(['/pagos/list']);
      },
      error: (err) => {
        console.error('Error creando pago:', err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Navigate back to payment list
   */
  volverLista(): void {
    this.router.navigate(['/pagos/list']);
  }

  /**
   * Getter for form controls to use in template
   */
  get f() {
    return this.pagoForm.controls;
  }
}
