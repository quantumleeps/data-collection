import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Location } from '../shared/models/location.model';

@Injectable()
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>('/api/locations');
  }

  countLocations(): Observable<number> {
    return this.http.get<number>('/api/locations/count');
  }

  addLocation(location: Location): Observable<Location> {
    return this.http.post<Location>('/api/location', location);
  }

  getLocation(location: Location): Observable<Location> {
    return this.http.get<Location>(`/api/location/${location._id}`);
  }

  editLocation(location: Location): Observable<string> {
    return this.http.put(`/api/location/${location._id}`, location, { responseType: 'text' });
  }

  deleteLocation(location: Location): Observable<string> {
    return this.http.delete(`/api/location/${location._id}`, { responseType: 'text' });
  }

}
