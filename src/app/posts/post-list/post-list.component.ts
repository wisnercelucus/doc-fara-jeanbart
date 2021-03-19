import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  

  constructor(private postService:PostServiceService) { }
  ngOnDestroy(): void {
    if(this.postSub){
      this.postSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListenner()
    .subscribe((posts:Post[]) => {
      this.posts = posts;
      this.isLoading = false;
    } );
  }

  onDeletePost(id:string){
    this.postService.deletePost(id);
  }
}
