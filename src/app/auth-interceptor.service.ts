import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";
export class AuthInterceptorService implements HttpInterceptor {

    //! runs code before the request leaves application
    intercept(req: HttpRequest<any>, next: HttpHandler): any {


        // ! modify request
        const modifiedRequest = req.clone({
            headers: req.headers.append('Auth', 'xyz')
        });

        return next.handle(modifiedRequest)
    }  //! request continues
}

