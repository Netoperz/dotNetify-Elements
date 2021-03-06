using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using DotNetify;
using DotNetify.Elements;

namespace dotNetify_Elements
{
   public class SampleForm : BaseVM
   {
      private class FormData
      {
         public string MyText { get; set; }
         public string MyPassword { get; set; }
         public float MyNumber { get; set; }
         public decimal MyMoney { get; set; }
         public DateTimeOffset MyDate { get; set; }
         public string MyDropdown { get; set; }
         public string[] MyMultiselect { get; set; }
         public string MyTextArea { get; set; }
         public string MyRadio { get; set; }
         public string MyRadioToggle { get; set; }
         public bool MyCheckbox { get; set; }
         public string[] MyCheckboxGroup { get; set; }
      }

      public SampleForm()
      {
         AddProperty(nameof(FormData.MyText), "")
             .WithAttribute(this, new TextFieldAttribute
             {
                Label = "Text:",
                Placeholder = "Enter text"
             });

         AddProperty(nameof(FormData.MyPassword), "")
             .WithAttribute(this, new TextFieldAttribute
             {
                Label = "Password:",
                Placeholder = "Enter password"
             });

         AddProperty<int>(nameof(FormData.MyNumber))
             .WithAttribute(this, new NumberFieldAttribute
             {
                Label = "Number:",
                Placeholder = "Enter number",
                Min = 0,
                Max = 999
             });

         AddProperty<decimal>(nameof(FormData.MyMoney))
             .WithAttribute(this, new TextFieldAttribute
             {
                Label = "Money:",
                Placeholder = "Enter amount",
                Prefix = "$",
                MaxLength = 11,
                Mask = new NumberMask
                {
                   IncludeThousandsSeparator = true,
                   AllowDecimal = true,
                   DecimalLimit = 2
                }
             });

         AddProperty(nameof(FormData.MyDate), DateTimeOffset.Now)
             .WithAttribute(this, new DateFieldAttribute
             {
                Label = "Date:",
                Min = DateTimeOffset.Now.AddMonths(-1),
                Max = DateTimeOffset.Now.AddMonths(6)
             });

         AddProperty(nameof(FormData.MyDropdown), "D3")
             .WithAttribute(this, new DropdownListAttribute
             {
                Label = "Dropdown list:",
                Options = new Dictionary<string, string>
                {
                  { "D1", "Dropdown 1" },
                  { "D2", "Dropdown 2" },
                  { "D3", "Dropdown 3" },
                  { "D4", "Dropdown 4" },
                  { "D5", "Dropdown 5" }
                }.ToArray()
             });

         AddProperty(nameof(FormData.MyMultiselect), new string[] { "M1", "M4" })
             .WithAttribute(this, new DropdownListAttribute
             {
                Label = "Multiselect list:",
                Options = new Dictionary<string, string>
                {
                  { "M1", "Multiselect 1" },
                  { "M2", "Multiselect 2" },
                  { "M3", "Multiselect 3" },
                  { "M4", "Multiselect 4" },
                  { "M5", "Multiselect 5" }
                }.ToArray()
             });

         AddProperty(nameof(FormData.MyTextArea), "")
             .WithAttribute(this, new TextAreaFieldAttribute { Label = "Text area:", Placeholder = "Enter text", Rows = 3 });

         AddProperty(nameof(FormData.MyRadio), "R1")
             .WithAttribute(this, new RadioGroupAttribute
             {
                Label = "Radio Group:",
                Options = new Dictionary<string, string>
                {
                  { "R1", "Radio 1" },
                  { "R2", "Radio 2" },
                  { "R3", "Radio 3" }
                }.ToArray()
             });

         AddProperty(nameof(FormData.MyRadioToggle), "R2")
             .WithAttribute(this, new RadioGroupAttribute
             {
                Label = "Radio Toggle:",
                Options = new Dictionary<string, string>
                {
                  { "R1", "Radio 1" },
                  { "R2", "Radio 2" },
                  { "R3", "Radio 3" }
                }.ToArray()
             });

         AddProperty(nameof(FormData.MyCheckbox), true)
             .WithAttribute(this, new CheckboxAttribute { Label = "Check me" });

         AddProperty(nameof(FormData.MyCheckboxGroup), new string[] { "C1", "C3" })
             .WithAttribute(this, new RadioGroupAttribute
             {
                Label = "Checkbox Group:",
                Options = new Dictionary<string, string>
                {
                  { "C1", "Checkbox 1" },
                  { "C2", "Checkbox 2" },
                  { "C3", "Checkbox 3" }
                }.ToArray()
             });

         AddProperty<string>("SubmitSuccess")
            .SubscribeTo(
               AddInternalProperty<FormData>("Submit").Select(data => SuccessMessage(data)));
      }

      private string SuccessMessage(FormData data) =>
         // Written in Github-flavored markdown format:
         $@"**Submitted:**<br/>
         MyText: **{WhitespaceIfEmpty(data.MyText)}**<br/>
         MyPassword: **{WhitespaceIfEmpty(data.MyPassword)}**<br/>
         MyNumber: **{data.MyNumber}**<br/>
         MyMoney: **{data.MyMoney}**<br/>
         MyDate: **{data.MyDate}**<br/>
         MyDropdown: **{data.MyDropdown}**<br/>
         MyMultiselect: **{WhitespaceIfEmpty(string.Join(", ", data.MyMultiselect))}**<br/>
         MyTextArea: **{WhitespaceIfEmpty(data.MyTextArea)}**<br/>
         MyRadio: **{data.MyRadio}**<br/>
         MyRadioToggle: **{data.MyRadioToggle}**<br/>
         MyCheckbox: **{data.MyCheckbox}**<br/>
         MyCheckboxGroup: **{WhitespaceIfEmpty(string.Join(", ", data.MyCheckboxGroup))}**";

      private string WhitespaceIfEmpty(string text) => !string.IsNullOrEmpty(text) ? text : " ";
   }
}