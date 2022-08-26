import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class PostService {
    loadedPosts: Post[] = [];
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };

        //..
        this.http
            .post<{ name: string }>(
                "https://test-project-34deb-default-rtdb.firebaseio.com/posts.json",
                postData,
                {
                    observe: 'response'
                }
            )
            .subscribe(
                (responseData) => {
                    console.log(responseData);
                },
                (error) => {
                    this.error.next(error.message);
                }
            );
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key'); // ! can append multiple params

        return this.http
            .get<{ [key: string]: Post }>(
                "https://test-project-34deb-default-rtdb.firebaseio.com/posts.json",
                {
                    headers: new HttpHeaders({ 'Custom-Headers': 'hello' }),
                    params: searchParams
                }

            ) // ! added get response body Type
            .pipe(
                map((responseData) => {
                    // ! wraps into observable
                    const postsArray: Post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key }); // ...pulls out key value pairs
                        }
                    }
                    console.log(postsArray);
                    return postsArray; // returned to subscribed function
                }),
                catchError((errorRes) => {
                    // send to analytics server
                    return throwError(errorRes); //! creates new observables
                })
            );

        // ..
    }

    deletePosts() {
        return this.http.delete(
            "https://test-project-34deb-default-rtdb.firebaseio.com/posts.json",
            {
                observe: 'events',
                responseType: 'json',
            })
            .pipe(
                tap(event => { //! tap - executes code without altering response
                    console.log(event);
                }));
    }
}
