import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/Usuario/Usuario.service';
import { Espacio } from 'src/app/models/espacio.model';
import { Router } from '@angular/router';
import { EspacioService } from 'src/app/services/Espacio/espacio.service';


@Component({
  selector: 'app-espacios-vecino',
  standalone: true,
  imports: [MatCardModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatTimepickerModule, MatFormFieldModule, MatInputModule, FormsModule, MatLabel],
  templateUrl: './espaciosVecino.component.html',
  styleUrls: ['./style.scss'],
  // MatNativeDateModule provides the native date adapter
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EspaciosVecinoComponent{
  selected: Date | null = null;
  readonly minDate = new Date();
  readonly maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  startTime: Date | null = null;
  endTime: Date | null = null;

  constructor(private espacioService: EspacioService, private usuarioService: UsuarioService, private router: Router) { }

  conjuntoId: string;
  espacios: Espacio[];
  
  ngOnInit(): void {
    this.getEspaciosActivosByConjunto()
  }

  getEspaciosActivosByConjunto(){
    const id = localStorage.getItem('id') || '';
    this.usuarioService.getUsuario(id).subscribe({
      next: (res)=>{
        this.conjuntoId = res.detalle.conjuntoId;
        this.espacioService.getEspaciosActivosByConjuntoId(this.conjuntoId).subscribe({
          next: (res)=>{
            this.espacios = res;
            console.log(res);
          },
          error: (err)=>{
            console.log(err);
          }
        })
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

}
