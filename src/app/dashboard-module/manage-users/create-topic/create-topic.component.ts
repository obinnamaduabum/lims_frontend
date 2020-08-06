import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ResponseModel} from '../../../models/response-model';
import {MatChipInputEvent} from '@angular/material/chips';
import {MyPubSubService} from '../../../service/mypubsub.service';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  createTopicFormGroup: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  allFruits: any[] = [];

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private fb: FormBuilder,
              private toastService: ToastrService,
              private myPubSub: MyPubSubService) {

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit() {
    this.createTopicFormGroup = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.getAllTopic();
  }


  addTopic() {
    this.myPubSub.createTopic(this.createTopicFormGroup.get('name').value).subscribe(data => {
      console.log(data);
      this.getAllTopic();
    }, error1 => {});
  }


  removeTopic(id: any, index: any) {
    this.myPubSub.deleteTopic(id).subscribe(data => {
      console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.allFruits.splice(index, 1);
        this.getAllTopic();
        this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {
      this.showFailed(error1.error.message);
    });
  }


  getAllTopic() {
    this.myPubSub.getAllTopics().subscribe(data => {

      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.allFruits = responseModel.data;
        console.log('ccc');
        console.log(this.allFruits);
      }
      console.log(data);
    }, error1 => {});
  }


  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.allFruits.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.fruitCtrl.setValue(null);
    }
  }

  remove(fruit: string, id: any): void {
    const index = this.getIndex(this.allFruits, id);
    console.log(fruit + ' ' + id);
    console.log(index);
    if (index >= 0) {
      this.removeTopic(id, index);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.allFruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

  getIndex(topics: any[], id: string) {
    return topics.findIndex(item => item.id === id);
  }
}
