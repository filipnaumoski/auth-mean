import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.authService.createUser(form.value.first_name, form.value.last_name, form.value.email, form.value.password);
    }
  }
}
