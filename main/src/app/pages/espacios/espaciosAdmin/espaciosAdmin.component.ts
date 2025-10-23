import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-espacios-admin',
    imports: [RouterModule, MaterialModule, CommonModule],
  templateUrl: './espaciosAdmin.component.html',
  styleUrls: ['./style.scss']
})
export class EspaciosAdminComponent {

  constructor() { }

  ngOnInit(): void {
  }
}