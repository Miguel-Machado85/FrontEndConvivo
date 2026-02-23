import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from 'src/app/models/comentario.model';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private api_url = 'http://localhost:3000/comentario'

  constructor(private http: HttpClient) { }

  addComentario(comentario: Comentario): Observable<any> {
    const endpoint = `${this.api_url}/create`;
    return this.http.post(endpoint, comentario);
  }

  getComentario(id: string): Observable<Comentario> {
    const endpoint = `${this.api_url}/get/${id}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario>(endpoint, { headers });
  }

  getComentarios(): Observable<Comentario[]> {
    const endpoint = `${this.api_url}/get`
    return this.http.get<Comentario[]>(endpoint);
  }

  getComentariosByUsuarioId(usuarioId: string): Observable<Comentario[]> {
    const endpoint = `${this.api_url}/getU/${usuarioId}`;
    const headers = {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
    };
    return this.http.get<Comentario[]>(endpoint, { headers });
  }
}
