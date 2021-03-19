import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
    //const userData = {email:this.form.value.email, password:this.form.value.password};
    this.authService.createUser(this.form.value.email, this.form.value.password);
  }

}
