import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private token:string|null="";
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer:any;
    private userId:string|null="";

    BACKEND_URL =  environment.APIUrl + "/accounts/";

  
    constructor(private http:HttpClient, private router:Router) { }

    getToken(){
        return this.token;
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email:string, password:string){
        const authData:AuthData = {email:email, password:password};

        this.http.post(this.BACKEND_URL+ 'signup', authData)
        .subscribe(res=>{
            this.router.navigate(["/auth/login"]);
        })
    }

    loginUser(email:string, password:string){
        const authData:AuthData = {email:email, password:password};

        this.http.post<{token:string, expiresIn:number, userId:string}>(this.BACKEND_URL + 'login', authData)
        .subscribe(res=>{
            
            this.token=res.token;
            this.userId = res.userId;
            if(this.token){
                const expireDuration= res.expiresIn;
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(["/"]);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expireDuration * 1000);
                this.saveAuthData(this.token, expirationDate, this.userId);
                this.setExpirationTimer(expireDuration);


            }
         
        })
    }

    getUserId(){
        return this.userId;
    }

    authoAuthUser(){
        const authInfo = this.getAuthData();
        if(authInfo){
            const now = new Date();
            const  isInFuture = authInfo!.expirationDate > now;
            const  remainningTime = authInfo!.expirationDate.getTime() - now.getTime();
    
            if(isInFuture){
                this.userId = authInfo!.userId;
                this.token =authInfo!.token;
                this.isAuthenticated=true;
                this.authStatusListener.next(true);
                this.setExpirationTimer(remainningTime/1000);
            }
        }
        else{
            return;
        }

    }

    private setExpirationTimer(duration:number){
        this.tokenTimer =setTimeout(()=>{
            this.logout();
        }, duration * 1000)
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expirationDate");
        const userId = localStorage.getItem("userId");
        if(!token || !expirationDate) return;

        return {
            token:token,
            expirationDate: new Date(expirationDate),
            userId:userId
        }
    }

    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId="";
        this.clearAuthData();
        if(this.tokenTimer){
            clearTimeout(this.tokenTimer);
        }
        this.router.navigate(["/"])
    }

    private saveAuthData(token:string, expirationDate:Date, userId:string){
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toISOString());
        localStorage.setItem("userId", userId);

    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
        localStorage.removeItem("userId");
    }
  
  }