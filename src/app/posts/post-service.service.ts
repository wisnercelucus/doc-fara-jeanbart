import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private posts:Post[] = [];

  BACKEND_URL =  environment.APIUrl + "/posts/";

  private postUpdated:Subject<{posts:Post[], postCount:number}> = new Subject<{posts:Post[], postCount:number}>();
  
  constructor(private http:HttpClient, private router:Router) { }

  getPosts(postPerPage:number, currentPage:number){
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;

    return this.http.get<{message:string, posts:any, maxPost:number}>(this.BACKEND_URL + queryParams)
    .pipe(map((postData)=>{
      return {posts:postData.posts.map((post:any) =>{
        
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath:post.imagePath,
          creator:post.creator
        }
      }), maxPost:postData.maxPost}
    }))
    .subscribe(postsData=>{
        this.posts = postsData.posts;
        this.postUpdated.next({posts:[...this.posts], postCount:postsData.maxPost});
      },

      err=>{
        console.log(err);
      })
  }

  getPostUpdateListenner(){
    return this.postUpdated.asObservable();
  }

  getPost(id:string){
    return this.http.get(this.BACKEND_URL + id);
  }

  addPost(title:string, content:string, file:File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", file ,title);
    this.http.post<{message:string, post:Post}>(this.BACKEND_URL, postData)
    .subscribe(res=>{
      this.router.navigate(["/"]);
    })
  }

  updatePost(id:string,title:string, content:string, image:any){
    let postData;

    if(typeof(image) ==='object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image ,title);

    }else{
      postData = {title:title, content:content, imagePath:image};
    }

    this.http.put<{post:any, message:string}>(this.BACKEND_URL + id, postData)
    .subscribe(res => {
      this.router.navigate(["/"]);
    })
  } 

  deletePost(id:string){
    return this.http.delete(this.BACKEND_URL+ id);
    
  }
}
