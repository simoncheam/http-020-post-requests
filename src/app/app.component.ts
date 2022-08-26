import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { PostService } from "./posts.service";
import { Subscription } from "rxjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostService) { }

  ngOnInit() {

    //! subscribe to error message
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    },
      error => {  // ! error handling
        this.isFetching = false;
        this.error = error.message

      });;
  }

  onCreatePost(postData: { title: string; content: string }) {

    this.postsService.createAndStorePost(postData.title, postData.content)

  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    },
      error => {
        this.isFetching = false;
        this.error = error.message;
        console.log(error)

      });;
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {   //! returns observable so we need to subscribe
      this.loadedPosts = [];
    })
  }
  onHandleError() {
    this.error = null;
  }


  ngOnDestroy() {
    this.errorSub.unsubscribe()
  }

}
