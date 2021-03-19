import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostServiceService } from '../post-service.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  postId:string|null="";
  post!: Post;
  isLoading=false;
  form!:FormGroup;
  imagePreview!:string|ArrayBuffer|null;
  postSub = new Subscription();

  constructor(private postService:PostServiceService, private route:ActivatedRoute){}
  ngOnDestroy(): void {
    if(this.postSub){
      this.postSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title':new FormControl(null, 
        {validators:[Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, 
        {validators:[Validators.required]}),
      'image': new FormControl(null, 
        {validators:[Validators.required],
        asyncValidators:[mimeType]
      })
    });

    this.postId = this.route.snapshot.paramMap.get("postId");
    if(this.postId){
      this.isLoading = true;
      this.postSub = this.postService.getPost(this.postId).subscribe(
        (res:any)=>{
          this.isLoading = false;
          let post_ = {id:res['_id'], title:res.title, content:res.content}
          this.post = post_;
          this.form.setValue({title:this.post.title, content:this.post.content})
        }
        
      );
    }
  }

  onSubmit(){
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.postId){
      const post:Post= {title:this.form.value.title, content:this.form.value.content};
      this.postService.updatePost(this.postId, post);

    }else{
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      this.form.reset();
    }

  }

  onImagePicked(event:Event){
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({image:file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();

    reader.onload = () =>{
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);
  }

}
