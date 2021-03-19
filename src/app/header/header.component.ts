import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListernerSub:Subscription|undefined;
  isAuthenticated:boolean=false;

  constructor(private authService:AuthService) { }
  

  ngOnDestroy(): void {
    if(this.authListernerSub){
      this.authListernerSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListernerSub = this.authService.getAuthStatusListener()
    .subscribe(res=>{
      if(res){
        this.isAuthenticated = true;
      }else{
        this.isAuthenticated = false;
      }

    })
  }

  logout(){
    this.authService.logout();
  }
}
