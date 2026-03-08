import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { ReservaService } from 'src/app/services/Reserva/reserva.service';
import { Reserva } from 'src/app/models/reserva.model';
import { ComentarioService } from 'src/app/services/Comentario/comentario.service';
import { Comentario } from 'src/app/models/comentario.model';

interface InfoField {
  label: string;
  value: any;
  icon: string;
  bgColor: string;
}

@Component({
  selector: 'app-detalle-vecino',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './detalle-vecino.component.html',
  styleUrls: ['./detalle-vecino.component.scss'],
})
export class DetalleVecinoComponent implements OnInit {
  usuario: Usuario | null = null
  reservas: Reserva[]
  reservasP: Reserva[]
  comentarios: Comentario[]
  vecinoId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private reservaService: ReservaService,
    private comentarioService: ComentarioService
  ) {}

  ngOnInit(): void {
    this.vecinoId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.vecinoId)

    this.getDatosVecino()
    this.getReservasFuturas()
    this.getReservasPasadas()
    this.getComentarios()
  }

  getDatosVecino(){
    this.usuarioService.getUsuario(this.vecinoId).subscribe({
      next: (res) =>{
        this.usuario = res;

        console.log(res);

      }, 
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getReservasFuturas(){
    const id = localStorage.getItem('id') || '';
    this.reservaService.getReservasByUsuarioId(id).subscribe({
      next: (res) =>{
        this.reservas = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getReservasPasadas(){
    const id = localStorage.getItem('id') || '';
    this.reservaService.getReservasPasadas(id).subscribe({
      next: (res) =>{
        this.reservasP = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  getComentarios(){
    const id = localStorage.getItem('id') || '';
    this.comentarioService.getComentariosByUsuarioId(id).subscribe({
      next: (res) =>{
        this.comentarios = res
        console.log(res)
      },
      error: (err) =>{
        console.log(err);
        
      }
    })
  }

  volverALista(): void {
    this.router.navigate(['/vecinos/ver-vecinos']);
  }

  getInfoFields(): InfoField[] {
    if (!this.usuario) return [];
    return [
      {
        label: 'Apartamento',
        value: this.usuario.numeroApartamento,
        icon: 'home',
        bgColor: 'info',
      },
      {
        label: 'Correo Electrónico',
        value: this.usuario?.correo,
        icon: 'email',
        bgColor: 'warning',
      },
      {
        label: 'Teléfono',
        value: this.usuario.telefono,
        icon: 'phone',
        bgColor: 'success',
      },
    ];
  }
}
