import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { LocationService } from '../services/location.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Location } from '../shared/models/location.model';
import { Group } from '../shared/models/location.model';
import { Point } from '../shared/models/location.model';
import { LocationChangeEvent } from '@angular/common';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  location = new Location();
  group = new Group();
  point = new Point();
  locations: Location[] = [];
  isLoading = true;
  isEditing = false;
  selectedLocation = new Location();
  selectedGroup = new Group();
  selectedPoint = new Point();

  addLocationForm: FormGroup;
  name = new FormControl('', Validators.required);
  country = new FormControl('', Validators.required);

  constructor(private locationService: LocationService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getLocations();
    this.addLocationForm = this.formBuilder.group({
      name: this.name,
      country: this.country,
      groups: []
    });
  }
  
  selectLocation(location: Location) {
    this.selectedLocation = location;
    this.selectedGroup = null;
    this.selectedPoint = null;
  }
  selectGroup(group: Location) {
    this.selectedGroup = group;
    this.selectedPoint = null;
    this.selectedLocation = null;
  }
  selectPoint(point: Location) {
    this.selectedPoint = point;
    this.selectedGroup = null;
    this.selectedLocation = null;
  }

  getLocations() {
    this.locationService.getLocations().subscribe(
      data => this.locations = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addLocation() {
    this.locationService.addLocation(this.addLocationForm.value).subscribe(
      res => {
        this.locations.push(res);
        this.addLocationForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(location: Location, group?: Group, point?: Point) {
    this.isEditing = true;
    this.location = location;
    if(group) {
      this.group = group;
    }
    if(point) {
      this.point = point;
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.location = new Location();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the locations to reset the editing
    this.getLocations();
  }

  editLocation(location: Location) {
    this.locationService.editLocation(location).subscribe(
      () => {
        this.isEditing = false;
        this.location = location;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteLocation(location: Location) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.locationService.deleteLocation(location).subscribe(
        () => {
          const pos = this.locations.map(elem => elem._id).indexOf(location._id);
          this.locations.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
