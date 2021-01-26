import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { PaymentService } from './payment.service';
import { ICreditCardPaymentDetails } from './credit-card-payment-details';

function futureDate(c: AbstractControl): { [key: string]: boolean } | null {
  let today: Date, expirationDate: Date, todayDateStr: string, expirationDateStr: string;
  if (c.value !== null) {

    today = new Date();
    expirationDate = new Date(c.value);
    todayDateStr = today.toLocaleDateString();
    expirationDateStr = expirationDate.toLocaleDateString();

    if (Date.parse(expirationDateStr) <= Date.parse(todayDateStr)) {
      return { futureDate: true };
    }
  }
  return null;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;
  paymentDetail: ICreditCardPaymentDetails;
  errorMessage: string;
  showSuccessAlert: boolean;

  constructor(private fb: FormBuilder, private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      creditCardNumber: ['', [Validators.required]],
      cardHolder: ['', [Validators.required]],
      expirationDate: [null, [Validators.required, futureDate]],
      securityCode: [undefined],
      amount: [undefined, [Validators.required, Validators.min(1)]]
    });

    const securityCodeControl = this.paymentForm.get('securityCode');
    securityCodeControl.valueChanges.subscribe(
      value => this.addSecurityCodeValidation(securityCodeControl)
    );

  }

  addSecurityCodeValidation(securityCodeControl: AbstractControl): void {
    if (securityCodeControl.value != null && securityCodeControl.value != undefined && securityCodeControl.value != '') {
      securityCodeControl.setValidators(Validators.pattern(/^\d{3}$/));
    } else {
      securityCodeControl.clearValidators();
    }
  }

  initializePayment(): ICreditCardPaymentDetails {
    return {
      id: 0,
      creditCardNumber: '',
      cardHolder: '',
      expirationDate: null,
      securityCode: '',
      Amount: undefined
    }
  }

  save(): void {
    console.log(this.paymentForm);
    console.log('Saved: ' + JSON.stringify(this.paymentForm.value));
    this.paymentDetail = this.initializePayment();
    const p = { ...this.paymentDetail, ...this.paymentForm.value };
    this.paymentService.createPayment(p)
      .subscribe({
        next: () => this.onSaveComplete(),
        error: err => this.errorMessage = err
      });
  }

  onSaveComplete(): void {
    this.showSuccessAlert = true;
    setTimeout(() => { this.showSuccessAlert = false; }, 3000);
    this.paymentForm.reset();
  }

}
