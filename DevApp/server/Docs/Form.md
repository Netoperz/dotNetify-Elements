﻿The element to group a set of input elements and manage their validation, error handling and data submission to the back-end.  It automatically associates _Button_ elements with _submit_ and _cancel_ attributes with the submit and cancel actions, respectively.  It also provides events for when the fields are changed, submitted, or couldn't be submitted due to validation errors. 

[inset]

```csharp
public class BasicForm : BaseVM
{
   private class FormData
   {
      public string Name { get; set; }
      public string Email { get; set; }
   }

   public BasicForm()
   {
      AddProperty<string>("Name")
         .WithAttribute(this, new TextFieldAttribute
         {
            Label = "Name:",
            Placeholder = "Enter your name (required)"
         })
         .WithRequiredValidation(this);

      AddProperty<string>("Email")
         .WithAttribute(this, new TextFieldAttribute
         { 
            Label = "Email:", 
            Placeholder = "Enter your email address" 
         })
         .WithPatternValidation(this, Pattern.Email, "Must be a valid email address.");

      AddProperty<FormData>("Register")
         .WithAttribute(this, new { Label = "Register" })
         .SubscribedBy(
            AddProperty<string>("ServerResponse"), submittedData => Save(submittedData));
   }

   private string Save(FormData data) => $"The name __'{data.Name}'__ with email '{data.Email}' was registered.";
}
```

#### Property Types

```jsx
static propTypes = {
   // Identifies a nested form. This Id will become property name in the master form data.
   id: PropTypes.string,

   // Replaces all input fields with plain text.
   plainText: PropTypes.bool,

   // Occurs when the form is submitted; emits the form data.
   onSubmit: PropTypes.func,

   // Occurs when there's validation error on submit; emits the error.
   onSubmitError: PropTypes.func,

   // Occurs when a field is changed; emits the changed state.
   onChanged: PropTypes.func
};
```