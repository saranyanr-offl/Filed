import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ICreditCardPaymentDetails } from './payment/credit-card-payment-details';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const payments = [
    ];
    return {payments};
  }

  genId(payments: ICreditCardPaymentDetails[]): number {
    return payments.length > 0 ? Math.max(...payments.map(hero => hero.id)) + 1 : 1;
  }
}