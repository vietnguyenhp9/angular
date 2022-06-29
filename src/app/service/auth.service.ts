import { environment } from "src/environments/environment";
import { HttpClient} from '@angular/common/http';
import { User } from "../module/auth.module";

export class AuthService{
    API=environment.API;
    constructor(private http:HttpClient,){}
    public login(user:User){
        return this.http.post(this.API+``,user).subscribe((res)=>console.log(res)
        )
    }
}