import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";
export class AuthInterceptorService implements HttpInterceptor {

    //! runs code before the request leaves application
    intercept(req: HttpRequest<any>, next: HttpHandler): any {
        console.log('Request is on its way');
        console.log(req.url)

        // ! modify request
        const modifiedRequest = req.clone({
            headers: req.headers.append('Auth', 'xyz')
        });

        return next.handle(modifiedRequest).pipe(tap(event => {
            console.log(event)
            if (event.type === HttpEventType.Response) {
                console.log('Response arrived, body data:')
                console.log(event.body)
            }

        }))
    }  //! request continues
}
