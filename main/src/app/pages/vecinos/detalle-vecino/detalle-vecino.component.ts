import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface InfoField {
  label: string;
  value: string;
  icon: string;
  bgColor: string;
}

export interface Reserva {
  id: number;
  espacio: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'Próxima' | 'Completada';
}

export interface Comentario {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  relacionado?: string;
}

export interface VecinoDetail {
  id: number;
  nombre: string;
  apartamento: string;
  telefono: string;
  correo: string;
  proximasReservas: Reserva[];
  reservasAnteriores: Reserva[];
  comentarios: Comentario[];
}

@Component({
  selector: 'app-detalle-vecino',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './detalle-vecino.component.html',
  styleUrls: ['./detalle-vecino.component.scss'],
})
export class DetalleVecinoComponent implements OnInit {
  vecino: VecinoDetail | null = null;
  vecinoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.vecinoId = params['id'];
      if (this.vecinoId) {
        this.loadVecinoDetail(this.vecinoId);
      }
    });
  }

  loadVecinoDetail(id: number): void {
    // Datos de ejempko temporales
    const mockVecina: VecinoDetail = {
      id: 1,
      nombre: 'Carlos Mendoza',
      apartamento: 'Apto 101',
      telefono: '+57 300 123 4567',
      correo: 'carlos.mendoza@email.com',
      proximasReservas: [
        {
          id: 1,
          espacio: 'Salón Social',
          fecha: '28 de febrero de 2028',
          horaInicio: '18:00',
          horaFin: '22:00',
          estado: 'Próxima',
        },
        {
          id: 2,
          espacio: 'Cancha de Tenis',
          fecha: '25 de febrero de 2028',
          horaInicio: '15:00',
          horaFin: '17:00',
          estado: 'Próxima',
        },
      ],
      reservasAnteriores: [
        {
          id: 3,
          espacio: 'BBQ Área',
          fecha: '10 de febrero de 2028',
          horaInicio: '15:00',
          horaFin: '18:00',
          estado: 'Completada',
        },
        {
          id: 4,
          espacio: 'Piscina',
          fecha: '30 de enero de 2028',
          horaInicio: '10:00',
          horaFin: '14:00',
          estado: 'Completada',
        },
      ],
      comentarios: [
        {
          id: 1,
          titulo: 'Ruido excesivo en horarios nocturnos',
          descripcion:
            'Se ha presentado caso muy fuerte después de las 11pm en el 308',
          fecha: '20 de febrero de 2026',
          relacionado: 'Juan Pérez',
        },
        {
          id: 2,
          titulo: 'Sugerencia para mejorar la iluminación del parqueadero',
          descripcion:
            'El parqueadero está muy oscuro en las noches, sería bueno instalar más luces LED...',
          fecha: '18 de febrero de 2026',
        },
        {
          id: 3,
          titulo: 'Mascotas sin correa en zonas comunes',
          descripcion:
            'He visto varias veces mascotas sin correa en el área de juegos infantiles...',
          fecha: '12 de febrero de 2026',
          relacionado: 'María González',
        },
      ],
    };
    this.vecino = mockVecina;
  }

  volverALista(): void {
    this.router.navigate(['/vecinos/ver-vecinos']);
  }

  getInfoFields(): InfoField[] {
    if (!this.vecino) return [];
    return [
      {
        label: 'Apartamento',
        value: this.vecino.apartamento,
        icon: 'home',
        bgColor: 'info',
      },
      {
        label: 'Correo Electrónico',
        value: this.vecino.correo,
        icon: 'email',
        bgColor: 'warning',
      },
      {
        label: 'Teléfono',
        value: this.vecino.telefono,
        icon: 'phone',
        bgColor: 'success',
      },
    ];
  }
}
