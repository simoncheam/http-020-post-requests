import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { PostService } from "./posts.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private http: HttpClient, private postsService: PostService) { }

  ngOnInit() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
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
    });;
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {   //! returns observable so we need to subscribe
      this.loadedPosts = [];
    })
  }


}
