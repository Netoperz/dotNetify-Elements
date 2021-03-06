﻿using DotNetify;
using DotNetify.Elements;
using System;

namespace dotNetify_Elements
{
   public class FormDateTimeField : BaseVM
   {
      public FormDateTimeField()
      {
         var markdown = Utils.GetResource("dotNetify_Elements.server.Docs.DateTimeField.md").Result;

         AddProperty("Overview", markdown.GetMarkdownSection(null, "Property Type"));
         AddProperty("API", markdown.GetMarkdownSection("Property Type"));
      }
   }

   public class DateTimeFieldExample : BaseVM
   {
      public DateTimeFieldExample()
      {
         AddProperty<DateTimeOffset?>("Date", DateTimeOffset.Now)
            .WithAttribute(this, new DateFieldAttribute
            {
               Label = "Date:"
            })
            .WithRequiredValidation(this);

         AddProperty<DateTimeOffset?>("Time", DateTimeOffset.Now)
            .WithAttribute(this, new DateFieldAttribute
            {
               Label = "Time:"
            });

         AddProperty<DateTimeOffset>("DateTime")
            .WithAttribute(this, new DateFieldAttribute
            {
               Label = "Date/time:",
               Placeholder = "Enter date...",
               Min = DateTimeOffset.Now.AddDays(-7),
               Max = DateTimeOffset.Now.AddDays(7)
            });
      }
   }

   public class DateTimeFieldCustomize : BaseVM
   {
      public DateTimeFieldCustomize()
      {
         AddProperty<DateTimeOffset>("MyDateTimeField", DateTime.Now)
            .WithAttribute(this, new DateFieldAttribute
            {
               Label = "Label:",
               Placeholder = "Placeholder"
            });
      }
   }
}