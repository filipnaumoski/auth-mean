import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }
  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(
      form.value.first_name,
      form.value.last_name,
      form.value.email,
      form.value.password
    );
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
