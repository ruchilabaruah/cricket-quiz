import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppService {
  constructor(private httpClient: HttpClient) {
  }

  getJsonData() {
    return this.httpClient.get('./assets/data.json');
  }
}