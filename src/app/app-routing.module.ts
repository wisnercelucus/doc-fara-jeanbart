import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { NotauthGuard } from './auth/notauth.guard';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {path: '',component: PostListComponent},
  {path: 'create',component: PostCreateComponent, canActivate:[AuthGuard]},
  {path: 'auth/login', component:LoginComponent, canActivate:[NotauthGuard]},
  {path: 'auth/signup', component:SignupComponent, canActivate:[NotauthGuard]},
  {path: 'edit/:postId', component: PostCreateComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
