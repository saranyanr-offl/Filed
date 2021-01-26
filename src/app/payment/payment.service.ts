import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { ICreditCardPaymentDetails } from './credit-card-payment-details';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseURL: string = 'api/payments';

  constructor(private http: HttpClient) { }

  createPayment(paymentDetail: ICreditCardPaymentDetails): Observable<ICreditCardPaymentDetails> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    paymentDetail.id = null;
    return this.http.post<ICreditCardPaymentDetails>(this.baseURL, paymentDetail, { headers })
      .pipe(
        tap(data => console.log('createPayment ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
