import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioRequest } from 'src/app/models/usuarioRequest.model';


@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private api_url = 'http://localhost:3000/usuario'

    constructor(private http: HttpClient) { }

    addUsuario(usuario: UsuarioRequest): Observable<any> {
        const endpoint = `${this.api_url}/crearUsuario`;
        return this.http.post(endpoint, usuario);
    }

    getUsuario(id: string): Observable <Usuario> {
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

    changePassword(token: string, newPassword: string){
        const endpoint = `${this.api_url}/password`;
        const body ={token, newPassword}
        return this.http.patch(endpoint, body);
    }

    updateVecino(id: string, data: any){
        const endpoint = `${this.api_url}/updateV/${id}`
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.patch(endpoint, data, {headers})
    }

    updateAdmin(id: string, data:any){
        const endpoint = `${this.api_url}/updateA/${id}`
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.patch(endpoint, data, {headers})
    }

    getVecinosByConjunto(conjunto: string){
        const endpoint = `${this.api_url}/verUsuariosConjunto/${conjunto}`;
        const headers = {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
        };
        return this.http.get< Usuario[] >(endpoint, { headers });
    }

}