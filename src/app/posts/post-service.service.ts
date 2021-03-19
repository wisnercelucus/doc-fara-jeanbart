import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private posts:Post[] = [];
  private postUpdated:Subject<Post[]> = new Subject<Post[]>();

  constructor(private http:HttpClient, private router:Router) { }

  getPosts(){
    return this.http.get<{message:string, posts:any}>("http://localhost:3000/api/posts")
    .pipe(map((postData)=>{
      return postData.posts.map((post:any) =>{
        return {
          title:post.title,
          content:post.content,
          id:post._id,
          imagePath:post.imagePath
        }
      })
    }))
    .subscribe(posts=>{
        this.posts = posts;
        this.postUpdated.next([...this.posts]);
      },

      err=>{
        console.log(err);
      })
  }

  getPostUpdateListenner(){
    return this.postUpdated.asObservable();
  }

  getPost(id:string){
    return this.http.get("http://localhost:3000/api/posts/" + id);
  }

  addPost(title:string, content:string, file:File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", file ,title);
    this.http.post<{message:string, post:Post}>("http://localhost:3000/api/posts/", postData)
    .subscribe(res=>{
      this.posts.push(res.post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }

  updatePost(id:string, post:Post){
    this.http.put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(res => {
      let updatedPosts = [...this.posts];
      let oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      post.id = id;
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  } 

  deletePost(id:string){
    this.http.delete("http://localhost:3000/api/posts/"+ id)
    .subscribe(res=>{
      const currentPosts = this.posts.filter(post => post.id !== id);
      this.posts = currentPosts;
      this.postUpdated.next([...this.posts]);
    })
  }
}
