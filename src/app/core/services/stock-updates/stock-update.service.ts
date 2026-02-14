import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockUpdateService {

  private baseUrl = 'http://localhost:3000';
  private apiUrl = 'http://localhost:3000/stocks';

  constructor(
    private http: HttpClient,
  ) { }

  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStockById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addStock(stock: any) {
    return this.http.post(this.apiUrl, stock);
  }

  updateStock(id: number, stock: any) {
    return this.http.put(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getStocksFiltered(filters: any): Observable<HttpResponse<any[]>> {
    
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      params = params.set(key, filters[key]);
    });

    return this.http.get<any[]>(this.apiUrl, {
      params,
      observe: 'response'
    });

  }


  /* Categories */
  getCategories() {
    return this.http.get<string[]>(`${this.baseUrl}/Categories`);
  }

  addCategory(category: string) {
    return this.http.post(`${this.baseUrl}/Categories`, category);
  }

}
