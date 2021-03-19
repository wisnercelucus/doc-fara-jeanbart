import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;

  form!:FormGroup;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, 
            {validators:[Validators.required, Validators.minLength(3)] }),

      password: new FormControl(null, 
           {validators:[Validators.required, Validators.minLength(3)] }),
    })
  }

  onSubmit(){
    this.authService.loginUser(this.form.value.email, this.form.value.password);
  }

}
