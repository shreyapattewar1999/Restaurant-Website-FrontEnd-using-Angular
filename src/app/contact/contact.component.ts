import { Component, OnInit, ViewChild } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';
import { MatSelectModule} from '@angular/material/select';

import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { flyInOut, expand } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(), expand()
  ]
})
export class ContactComponent implements OnInit {

  ngOnInit() :void{

  }
  feedbackForm: FormGroup;
  feedback : Feedback;
  feedbackCopy : Feedback;
  feedbackErrMsg : string;
  isLoading: boolean;
  isShowingResponse: boolean;
  
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective: any;

  formErrors : any = {
    'firstname' :'',
    'lastname' : '',
    'telnum' : '',
    'email' : ''
  }
  
  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
      feedbackForm: FormGroup;
      this.createForm();
      this.isLoading = false;
      this.isShowingResponse = false;

   }
   validationMessages : any= {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

   createForm() {
      this.feedbackForm = this.fb.group({
        firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        telnum: [0, [Validators.required, Validators.pattern]],
        email: ['', [Validators.required, Validators.email]],
        agree: [false],
        contacttype: ['None'],
        message : ['']
   });

   this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

   this.onValueChanged();

   }
   onValueChanged(data?: any) {
    if(!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors ) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control || control.dirty || !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
              // console.log(this.formErrors[field]);
            }
          }
        }
      }
    }
  }
  
  onSubmit() {
    this.isLoading = true;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);

    this.feedbackService.putFeedback(this.feedback).subscribe(feedback => {
      this.feedback = feedback;
      this.feedbackCopy = feedback;
    },
    errMsg => {
      this.feedback = null;
      this.feedbackCopy = null;
      this.feedbackErrMsg = errMsg;
    },
    () => {
      this.isShowingResponse = true;
      setTimeout(() =>{
        this.isShowingResponse = false;
        this.isLoading = false;
      },5000);
    }

    );
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contacttype: 'None',
      message : ''
    });
    this.feedbackFormDirective.resetForm();
  }
}
