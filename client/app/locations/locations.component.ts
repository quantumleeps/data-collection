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
  addGroupForm: FormGroup;
  addPointForm: FormGroup;
  locationName = new FormControl('', Validators.required);
  locationCountry = new FormControl('', Validators.required);
  groupName = new FormControl('', Validators.required);
  groupDescription = new FormControl('', Validators.required);
  pointName = new FormControl('', Validators.required);
  pointUnits = new FormControl('', Validators.required);

  constructor(private locationService: LocationService,
    private formBuilder: FormBuilder,
    public toast: ToastComponent) { }

  ngOnInit() {
    this.getLocations();
    this.addLocationForm = this.formBuilder.group({
      name: this.locationName,
      country: this.locationCountry,
      groups: []
    });
    this.addGroupForm = this.formBuilder.group({
      name: this.groupName,
      description: this.groupDescription,
      points: []
    });
    this.addPointForm = this.formBuilder.group({
      name: this.pointName,
      units: this.pointUnits,
    });
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };


  resetSelections() {
    this.selectedGroup = new Group();
    this.selectedPoint = new Point();
    this.selectedLocation = new Location();
  }

  resetLocationSelect() {
    this.selectedLocation = new Location();
  }

  resetGroupSelect() {
    this.selectedGroup = new Group();
  }

  resetPointSelect() {
    this.selectedPoint = new Point();
  }

  selectLocation(location: Location) {
    this.selectedLocation = location;
    // this.selectedGroup = new Group();
    // this.selectedPoint = new Point();
  }
  selectGroup(group: Group) {
    this.selectedGroup = group;

    // this.selectedPoint = new Point();
    // this.selectedLocation = new Location();
  }
  selectPoint(point: Point) {
    this.selectedPoint = point;
    // this.selectedGroup = new Group();
    // this.selectedLocation = new Location();
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
        console.log(this.addLocationForm.value)
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }


  enableEditing(location: Location, group?: Group, point?: Point) {
    this.isEditing = true;
    this.location = location;
    if (group) {
      this.group = group;
    }
    if (point) {
      this.point = point;
    }
  }

  addGroup() {
    if (this.selectedLocation.groups) {
      var group = new Group();
      group['name'] = this.addGroupForm.value.name;
      group['description'] = this.addGroupForm.value.description;
      this.selectedLocation.groups.push(group)
    } else {
      var group = new Group();
      group['name'] = this.addGroupForm.value.name;
      group['description'] = this.addGroupForm.value.description;
      this.selectedLocation.groups = [group];
      console.log(group)
      console.log('nopesies')
    }
    this.locationService.editLocation(this.selectedLocation).subscribe(
      () => {
        this.isEditing = false;
        this.location = this.selectedLocation;
        this.toast.setMessage('group added successfully.', 'success');
      },
      error => console.log(error)
    );
    this.addGroupForm.reset();
  }

  deleteGroup(group: Group) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      var i = this.selectedLocation.groups.indexOf(group);
      if (i > -1) {
        var i = this.selectedLocation.groups.indexOf(group);
        this.selectedLocation.groups.splice(i, 1);
        this.locationService.editLocation(this.selectedLocation).subscribe(
          () => {
            this.isEditing = false;
            this.location = this.selectedLocation;
            this.toast.setMessage('group deleted successfully.', 'success');
          },
          error => console.log(error)
        );
      }
    }
  }

  deletePoint(point: Point) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      var i = this.selectedGroup.points.indexOf(point);
      if (i > -1) {
        this.selectedGroup.points.splice(i, 1);
        this.locationService.editLocation(this.selectedLocation).subscribe(
          () => {
            this.isEditing = false;
            this.location = this.selectedLocation;
            this.toast.setMessage('point deleted successfully.', 'success');
          },
          error => console.log(error)
        );
      }
    }
  }

  addPoint() {
    if (this.selectedGroup.points) {
      var point = new Point();
      point['name'] = this.addPointForm.value.name;
      point['units'] = this.addPointForm.value.units;
      this.selectedGroup.points.push(point)
    } else {
      var point = new Point();
      point['name'] = this.addPointForm.value.name;
      point['description'] = this.addPointForm.value.description;
      this.selectedGroup.points = [point];
    }
    this.locationService.editLocation(this.selectedLocation).subscribe(
      () => {
        this.isEditing = false;
        this.location = this.selectedLocation;
        this.toast.setMessage('group added successfully.', 'success');
      },
      error => console.log(error)
    );
    this.addGroupForm.reset();
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
