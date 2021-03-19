import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { PostServiceService } from '../post-service.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading=false;
  @Input() posts:Post[] = [];
  postSub:Subscription|undefined=undefined;
  postdeleteSubs :Subscription|undefined=undefined;
  totalPosts = 10;
  postPerPage=3;
  currentPage=1;
  pageSizeOptions=[5, 10, 25, 100];
  authListernerSub:Subscription|undefined;
  isAuthenticated =false;
  userId:string|null="";

  constructor(private postService:PostServiceService, private authService:AuthService) { }
  ngOnDestroy(): void {
    if(this.postSub){
      this.postSub.unsubscribe();
    }
    if(this.postdeleteSubs){
      this.postdeleteSubs.unsubscribe();
    }
    if(this.authListernerSub){
      this.authListernerSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListernerSub = this.authService.getAuthStatusListener()
    .subscribe(res=>{
      if(res){
        this.isAuthenticated = true;
        this.userId = this.authService.getUserId();
      }else{
        this.isAuthenticated = false;
        this.userId ="";
      }

    })
    this.isLoading=true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postSub = this.postService.getPostUpdateListenner()
    .subscribe((postData:any) => {
      this.posts = postData.posts;
      this.isLoading = false;
      this.totalPosts = postData.postCount;
    } );
  }

  onChangePage(eventData:PageEvent){
    this.currentPage = eventData.pageIndex + 1;
    this.postPerPage = eventData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);

  }

  onDeletePost(id:string){
    this.isLoading=true;
    this.postdeleteSubs = this.postService.deletePost(id)
    .subscribe(res=>{
      this.postService.getPosts(this.postPerPage, this.currentPage);
      this.isLoading=false;
    })
    
  }
}
