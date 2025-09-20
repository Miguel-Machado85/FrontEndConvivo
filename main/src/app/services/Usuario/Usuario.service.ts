import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';


@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private api_url = 'http://localhost:3000/usuario'

    constructor(private http: HttpClient) { }

    addUsuario(usuario: Usuario): Observable<any> {
        const endpoint = `${this.api_url}/crearUsuario`;
        return this.http.post(endpoint, usuario);
    }

    getUsuario(id: string) {
        const endpoint = `${this.api_url}/verUsuario/${id}`;
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.get<Usuario>(endpoint, { headers });
    }

    getUsuarios(): Observable <Usuario[]> {
        const endpoint = `${this.api_url}/verUsuarios`;
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.get<Usuario[]>(endpoint, { headers });
    }



}